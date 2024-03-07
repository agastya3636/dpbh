import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.models import Sequential, load_model
from keras.layers import Embedding, Bidirectional, LSTM, Dense, SpatialDropout1D
import pickle

data = pd.read_csv('C:/Users/agast/OneDrive/Desktop/DPBH/python/dataset.csv')

label_encoder = LabelEncoder()
data['label'] = label_encoder.fit_transform(data['label'])

max_words = 10000
tokenizer = Tokenizer(num_words=max_words)
tokenizer.fit_on_texts(data['text'].values)

X = tokenizer.texts_to_sequences(data['text'].values)
X = pad_sequences(X)

X_train, X_test, y_train, y_test = train_test_split(X, data['label'].values, test_size=0.2, random_state=42)

embedding_dim = 128
lstm_units = 100

model = Sequential()
model.add(Embedding(max_words, embedding_dim, input_length=X.shape[1]))
model.add(SpatialDropout1D(0.2))
model.add(Bidirectional(LSTM(lstm_units)))
model.add(Dense(1, activation='sigmoid'))
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

batch_size = 64
epochs = 5
model.fit(X_train, y_train, validation_split=0.2, epochs=epochs, batch_size=batch_size)

# Save the model
model.save("model.h5")

# Save the tokenizer
with open('tokenizer.pkl', 'wb') as tokenizer_file:
    pickle.dump(tokenizer, tokenizer_file)

# Save the label encoder
with open('label_encoder.pkl', 'wb') as label_encoder_file:
    pickle.dump(label_encoder, label_encoder_file)

loss, accuracy = model.evaluate(X_test, y_test, verbose=1)
print(f'Test Accuracy: {accuracy * 100:.2f}%')

# Load the model using Keras
loaded_model = load_model("model.h5")

# Load the tokenizer
with open('tokenizer.pkl', 'rb') as tokenizer_file:
    loaded_tokenizer = pickle.load(tokenizer_file)

# Load the label encoder
with open('label_encoder.pkl', 'rb') as label_encoder_file:
    loaded_label_encoder = pickle.load(label_encoder_file)

new_texts = ['55% off Hurry! Sale ends soon', '12 seats remaining', 'Almost Sold Out', 'Hello', 'goodbye']
sequences = loaded_tokenizer.texts_to_sequences(new_texts)
padded_sequences = pad_sequences(sequences, maxlen=X.shape[1])
predictions = loaded_model.predict(padded_sequences)

decoded_predictions = loaded_label_encoder.inverse_transform((predictions > 0.5).astype(int).flatten())

dark_patterns = [new_texts[i] for i, label in enumerate(decoded_predictions) if label == 1]

print("These are Dark Patterns:")
for text in dark_patterns:
    print(text)
