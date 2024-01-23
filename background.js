chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "sendDataToServer") {
      console.log("Data received in background script:", request.data);
      console.log("ul:",request.url)
      fetch("http://127.0.0.1:3000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: request.data ,url :request.url}),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // Use response.json() directly
        })
        .then((data) => {
          console.log("Response from server:", data);
          sendResponse({ status: "Success", message: "Data sent to the server" });
        })
        .catch((error) => {
          console.error("Error sending data to server:", error);
          sendResponse({ status: "Error", message: error.message });
        });
  
      return true;
    }
  });
  