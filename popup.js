//popup.js

document.getElementById("loadData").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getPageData",
        tabUrl: tabs[0].url
     },
        (response) => {
          if (chrome.runtime.lastError) {
            document.getElementById("dataDisplay").textContent =
              "Error: " + chrome.runtime.lastError.message;
            return;
          }
          console.log("hi"+response);
          // Check if response contains data property
          if (response && response.data) {
            document.getElementById("dataDisplay").textContent = response.data.join("\n");
        } else {
            document.getElementById("dataDisplay").textContent = "No data received.";
        }
        }
      );
    });
  });
  