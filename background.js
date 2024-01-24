chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "sendDataToServer") {
      console.log("Data received in background script:", request.data);
      console.log("ul:",request.url)
      d={ data: request.data ,url :request.url}
      fetch("http://127.0.0.1:8000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify(d),
       
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); 
        })
        .then((data) => {
          console.log("Response from server:", data);
          sendResponse(data);
        })
        .catch((error) => {
          console.error("Error sending data to server:", error);
          sendResponse({ status: "Error", message: error.message });
        });
  
      return true;
    }
  });
  