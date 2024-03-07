

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

//     if (message.action === "notification") {
//         console.log("received: " + message.tabURL);
//         const data = { url: message.url }; 
//         fetch("http://127.0.0.1:8000/permission", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data)
//         }).then((response) => {
//             if (!response.ok) {
//                 console.log("error in sending to python file");
//                 throw new Error("Failed to fetch");
//             }
//             return response.json();
//         }).then((data) => {
//             console.log("Response from server:", data);

//             chrome.runtime.sendMessage({ action:"permissionresponse",status: "Success",datafromserver:data });
//         }).catch((error) => {
//             console.error("Error:", error);
//             sendResponse({ status: "Error", message: "Failed to fetch from the server" });
//         });
    
//     }
//     else if(message.action==="redirection"){
//         const data={
//             url:message.url
//         };
//         fetch("http://127.0.0.1:8000/redirection",{
//             method:"POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data)
    
//         }).then((response) => {
//             if (!response.ok) {
//                 console.log("error in sending to python file");
//                 throw new Error("Failed to fetch");
//             }
//             return response.json();
//         }).then((data) => {
//             console.log("Response from server:", data.Response);
//             chrome.runtime.sendMessage({ action:"redirectionresponse",status: "Success", datafromserver:data});
//         }).catch((error) => {
//             console.error("Error:", error);
//             sendResponse({ status: "Error", message: "Failed to fetch from the server" });
//         });
//     }
//     else if(message.action==="graph"){
//         const data={
//             url:message.url
//         };
//         fetch("http://127.0.0.1:8000/graph",{
//             method:"POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data)
    
//         }).then((response) => {
//             if (!response.ok) {
//                 console.log("error in sending to python file");
//                 throw new Error("Failed to fetch");
//             }
//             return response.json();
//         }).then((data) => {
//             console.log("Response from server:", data.graph);
//             chrome.runtime.sendMessage({ action:"graphresponse",status: "Success", datafromserver:data.graph});
//         }).catch((error) => {
//             console.error("Error:", error);
//             sendResponse({ status: "Error", message: "Failed to fetch from the server" });
//         });
//     }
//     else if(message.action==="ssl"){
//         const data={
//             url:message.url
//         };
//         fetch("http://127.0.0.1:8000/ssl",{
//             method:"POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data)
    
//         }).then((data) => {
//             console.log("Response from server:", data);
//             sendResponse({ status: "Success", message: "Data sent to the server" });
//         }).catch((error) => {
//             console.error("Error:", error);
//             sendResponse({ status: "Error", message: "Failed to fetch from the server" });
//         });
//     }
//     else if(message.action==="mlmodel"){
//         const data={
//             url:message.url
//         };
//         fetch("http://127.0.0.1:8000/mlmodel",{
//             method:"POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data)
    
//         }).then((data) => {
//             console.log("Response from server:", data);
//             sendResponse({ status: "Success", message: "Data sent to the server" });
//         }).catch((error) => {
//             console.error("Error:", error);
//             sendResponse({ status: "Error", message: "Failed to fetch from the server" });
//         });
//     }
    
    
//     });


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "notification") {
      console.log("received: " + message.tabURL);
      const data = { url: message.url }; 
      fetch("http://127.0.0.1:8000/permission", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data)
      })
      .then(response => {
          if (!response.ok) {
              console.log("error in sending to python file");
              throw new Error("Failed to fetch");
          }
          return response.json();
      })
      .then(data => {
          console.log("Response from server:", data);
          chrome.runtime.sendMessage({ action: "permissionresponse", status: "Success", datafromserver: data });
      })
      .catch(error => {
          console.error("Error:", error);
          chrome.runtime.sendMessage({ action: "permissionresponse", status: "Error", message: "Failed to fetch from the server" });
      });
  }
  else if (message.action === "redirection") {
      const data = {
          url: message.url
      };
      fetch("http://127.0.0.1:8000/redirection", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data)

      }).then(response => {
          if (!response.ok) {
              console.log("error in sending to python file");
              throw new Error("Failed to fetch");
          }
          return response.json();
      }).then(data => {
          console.log("Response from server:", data.Response);
          chrome.runtime.sendMessage({ action: "redirectionresponse", status: "Success", datafromserver: data });
      }).catch(error => {
          console.error("Error:", error);
          chrome.runtime.sendMessage({ action: "redirectionresponse", status: "Error", message: "Failed to fetch from the server" });
      });
  }
  else if (message.action === "graph") {
      const data = {
          url: message.url
      };
      fetch("http://127.0.0.1:8000/graph", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data)

      }).then(response => {
          if (!response.ok) {
              console.log("error in sending to python file");
              throw new Error("Failed to fetch");
          }
          return response.json();
      }).then(data => {
          console.log("Response from server:", data);
          console.log("ra")
          chrome.runtime.sendMessage({ action: "gresponse", status: "Success", datafromserver: data.graph });
      }).catch(error => {
          console.error("Error:", error);
          chrome.runtime.sendMessage({ action: "gresponse", status: "Error", message: "Failed to fetch from the server" });
      });
  }
  else if (message.action === "ssl") {
      const data = {
          url: message.url
      };
      fetch("http://127.0.0.1:8000/ssl", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data)

      }).then(response => {
          if (!response.ok) {
              console.log("error in sending to python file");
              throw new Error("Failed to fetch");
          }
          return response.json();
      }).then(data => {
          console.log("Response from server:", data);
          chrome.runtime.sendMessage({ action: "sslresponse", status: "Success", datafromserver: data });
      }).catch(error => {
          console.error("Error:", error);
          chrome.runtime.sendMessage({ action: "sslresponse", status: "Error", message: "Failed to fetch from the server" });
      });
  }
  else if (message.action === "mlmodel") {
      
      const data = {
          url: message.url,
          scdata:message.scdata
      };
      
      fetch("http://127.0.0.1:8000/mlmodel", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data)

      }).then(response => {
          if (!response.ok) {
              console.log("error in sending to python file");
              throw new Error("Failed to fetch");
          }
          return response.json();
      }).then(data => {
          console.log("Response from server:", data);
          console.log ("ra",data.mlmodel)
          sendResponse({ status: "Success", message: data });
          chrome.runtime.sendMessage({ action: "mlmodelresponse", status: "Success", datafromserver: data.mlmodel });
      }).catch(error => {
          console.error("Error:", error);
          chrome.runtime.sendMessage({ action: "mlmodelresponse", status: "Error", message: "Failed to fetch from the server" });
      });
      return true;
  }
});

function highlightcall(data){
  console.log("Highlight ra",data)
  const contentDiv = document.createElement("div")
  contentDiv.id = "content";
  const card = document.createElement("div")
          card.classList.add("card");
          const title = document.createElement("h2")
          title.textContent = data;
          card.appendChild(title);
          contentDiv.appendChild(card);
          const pElement = document.getElementById("p");
      pElement.innerHTML = ''
      pElement.appendChild(contentDiv);
}