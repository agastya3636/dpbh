
import re
from flask import Flask, request, jsonify
import ssl as ssl_module
import socket
import OpenSSL
import requests
import whois
from bs4 import BeautifulSoup
import logging
import os
import sys
import json
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from sklearn.preprocessing import LabelEncoder
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from joblib import load
import pickle
from keras.models import load_model
from flask import Flask, request, jsonify
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from keras.models import load_model
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
import pickle
import requests
import logging
from flask import Flask, jsonify, request
from bs4 import BeautifulSoup
import pickle
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
import pandas as pd

presence_classifier = load('presence_classifier.joblib')
presence_vect = load('presence_vectorizer.joblib')
category_classifier = load('category_classifier.joblib')
category_vect = load('category_vectorizer.joblib')



app = Flask(__name__)


def our_ml_model(new_texts):
    
    # Load the tokenizer and label encoder
    with open('tokenizer.pkl', 'rb') as tokenizer_file:
        tokenizer = pickle.load(tokenizer_file)

    with open('label_encoder.pkl', 'rb') as label_encoder_file:
        label_encoder = pickle.load(label_encoder_file)

    # Load the trained model
    loaded_model = load_model('model1.h5')

    # Tokenize and pad the new texts
    sequences = tokenizer.texts_to_sequences(new_texts)
    padded_sequences = pad_sequences(sequences, maxlen=147)

    # Make predictions
    predictions = loaded_model.predict(padded_sequences)

    # Decode predictions and return them
    result=set()
    decoded_predictions = label_encoder.inverse_transform((predictions > 0.5).astype(int).flatten())
    # decoded_predictions=tuple(decoded_predictions)
    for  i in range(len (decoded_predictions)):
        if(int(decoded_predictions[i])==1):
            result.add(new_texts[i])
    return list(result) 

def redirection_same_tab(url):
    try:
        response = requests.get(url, allow_redirects=True)
        final_url = response.url
        return final_url != url
    except Exception as e:
        return False

def redirection_new_tab(url):
    try:
        element_selector = "body"
        driver = webdriver.Chrome()
        driver.get(url)
        clickable_element = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, element_selector)))
        original_window_handle = driver.current_window_handle
        clickable_element.click()
        WebDriverWait(driver, 10).until(lambda driver: len(driver.window_handles) > 1)
        new_window_handle = [handle for handle in driver.window_handles if handle != original_window_handle][0]
        driver.switch_to.window(new_window_handle)
        final_url = driver.current_url
        driver.quit()
        return final_url != url

    except Exception as e:
        return 0
    finally:
        driver.quit()
def convert_bytes_to_strings(data):
    if isinstance(data, bytes):
        return data.decode('utf-8')
    elif isinstance(data, dict):
        return {convert_bytes_to_strings(key): convert_bytes_to_strings(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_bytes_to_strings(item) for item in data]
    else:
        return data
def redirectioncheck(url):
    r1 = redirection_same_tab(url)
    if r1:
        return 1==r1
    r2 = redirection_new_tab(url)
    return r2==1

def check_permissions(url):
    try:
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--disable-gpu')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument("--pageLoadStrategy=none")
        options.add_argument('--disable-infobars')

        with webdriver.Chrome(options=options) as driver:
            driver.get(url)

            geolocation_permission = driver.execute_script(
                'return navigator.permissions.query({ name: "geolocation" }).then(permissionStatus => permissionStatus.state);')
            per = {'Geolocation_permission': geolocation_permission}

            camera_permission = driver.execute_script(
                'return navigator.permissions.query({ name: "camera" }).then(permissionStatus => permissionStatus.state);')
            per['Camera_permission'] = camera_permission

            microphone_permission = driver.execute_script(
                'return navigator.permissions.query({ name: "microphone" }).then(permissionStatus => permissionStatus.state);')
            per['Microphone_permission'] = microphone_permission

            notification_permission = driver.execute_script('return Notification.permission;')
            per['Notification_permission'] = notification_permission

            return per

    except Exception as error:
        return {'error': str(error)}


def scrap_graph(url):
    base_url = 'https://www.pricebefore.com/search/?category=mobiles&q='
    full_url = base_url + url
    response = requests.get(full_url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        price_info = {}
        price_section = soup.find(class_="cmo-mod cmo-product-price-overview")
        if price_section:
            all_items = price_section.find_all(class_="item")
            for item in all_items:
                divs = item.find_all('div')
                if len(divs) == 2:
                    price_info[divs[0].text.strip()] = divs[1].text.strip()
        
        # Extracting script related to price history chart
        scripts = soup.find_all('script')
        for script in scripts:
            if "document.getElementById('price_history_chart')" in script.text:
                # print(script)
                var_regex = r'(?:const|let|var)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*([^;]+);'

                # Extract variable names and values
                matches = re.findall(var_regex, script.text)
            
                # Create a dictionary to store variable names and their values
                variables = {name: value.strip() for name, value in matches}
                variables['data']=json_object = json.loads(variables['data'])
                # for i in variables['data']:
                #     jsonify(i)
                print(variables['data'])
               
                # for i in variables['data']:
                    # print(i)
                # print (variables['data'] )
                
                price_info['val']=variables['data']      
        
        return price_info
    else:
        return "Error"

# def scrap_graph(url):
#     ul = 'https://www.pricebefore.com/search/?category=mobiles&q=' + url
#     response = requests.get(ul)
#     if response.status_code == 200:
#         soup = BeautifulSoup(response.text, 'html.parser')
#         price={}
#         price=soup.find_all(class_="cmo-mod cmo-product-price-overview")
#         allp=price[0].find_all(class_="item")
#         for a in allp:
#             div=a.find_all('div')
#             price[div[0].text]=price[div[1].text]
#         script = soup.find_all('script')
#         for s in script:
#             if "document.getElementById('price_history_chart')" in s.text:
#                 price['s']=s
#         return price
#     else:
#         return "Error"

def check_ssl_domain(url):
    try:
        domain = url.split("/")[2]
        print(domain)
        certificate_data = get_certificate(domain)
        if certificate_data:
            parsed_certificate = parse_certificate(certificate_data)
            if parsed_certificate:
                certificate_data = parsed_certificate

        whois_info = get_whois_info(domain)
        return {"status": True, "whois_info": whois_info, "certificate_data": certificate_data}
    except Exception as e:
        return {"status": False, "data": str(e)}

def get_whois_info(domain):
    try:
        whois_info = whois.whois(domain)
        return whois_info
    except whois.parser.PywhoisError as e:
        return {'error': str(e)}

def get_certificate(host, port=443, timeout=10):
    context = ssl_module.create_default_context()
    with socket.create_connection((host, port)) as sock:
        with context.wrap_socket(sock, server_hostname=host) as ssl_sock:
            der_cert = ssl_sock.getpeercert(True)
    return ssl_module.DER_cert_to_PEM_cert(der_cert)

def parse_certificate(certificate):
    x509 = OpenSSL.crypto.load_certificate(OpenSSL.crypto.FILETYPE_PEM, certificate)

    result = {
        'subject': dict(x509.get_subject().get_components()),
        'issuer': dict(x509.get_issuer().get_components()),
        'serialNumber': x509.get_serial_number(),
        'version': x509.get_version(),
        'notBefore': datetime.strptime(x509.get_notBefore().decode('utf-8'), '%Y%m%d%H%M%SZ'),
        'notAfter': datetime.strptime(x509.get_notAfter().decode('utf-8'), '%Y%m%d%H%M%SZ'),
    }

    extensions = (x509.get_extension(i) for i in range(x509.get_extension_count()))
    extension_data = {e.get_short_name().decode('utf-8'): e.__str__() for e in extensions}
    result.update(extension_data)

    return result

@app.route('/permission', methods=['POST'])
def permission():
    try:
        data = request.get_json()
        b = data['url']
        p = check_permissions(b)
        print(jsonify({"status": "Success", "permission": p}))
        return jsonify({"status": "Success", "permission": p})
    except Exception as e:
        return jsonify({"status": "Error", "message": str(e)})

@app.route('/redirection', methods=['POST'])
def redirection():
    try:
       
        data = request.get_json()
     
        b = data['url']
     
        r = (redirectioncheck(b))
        # print(({"status": "Success", "redirection":r}))
        # print(r)
        return jsonify({"status": "Success", "redirection":r})
    except Exception as e:
        return jsonify({"status": "Error", "message": str(e)})

@app.route('/graph', methods=['POST'])
def getgraph():
    try:
        # print("In graph")
        data = request.get_json()
        # print(data)
        ul = data['url']
        sc = scrap_graph(ul)
        # print(sc)
        return jsonify({"status": "Success", "graph": sc})
    except Exception as e:
        return jsonify({"status": "Error", "message": str(e)})

@app.route('/ssl', methods=['POST'])
def ssl():
    try:
        data = request.get_json()
        url = data['url']
        # print(url)
        ssl_info = check_ssl_domain(url)
        # print(ssl_info)
        ssl_info=convert_bytes_to_strings(ssl_info)
        return jsonify({"status": "Success", "ssl": ssl_info})
    except Exception as e:
        return jsonify({"status": "Error", "message": str(e)})
@app.route("/mlmodel", methods=['POST'])
def ml_model():
    try:
       
        data = request.get_json()

        # for token in data:
        #     result = presence_classifier.predict(presence_vect.transform([token]))
        #     if result == 'Dark':
        #         cat = category_classifier.predict(category_vect.transform([token]))
        #         output.append(cat[0])
        #     else:
        #         output.append(result[0])

        # dark = [data[i] for i in range(len(output)) if output[i] == 'Dark']
        # for d in dark:
        #     print(d)
        # print()
        # print(len(dark))

        # message = '{ \'result\': ' + str(output) + ' }'
        # print(message)

        # json = jsonify(message)
        print(data['scdata'])
        json=our_ml_model(data['scdata'])
        print((json))
        print(len(json))
        return jsonify({"status": "Success", "mlmodel": json,"length":len(json)})
     
    except Exception as e:
        return jsonify({"status": "Error", "message": str(e)})
    
if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000, debug=True)
