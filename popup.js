// popup.js
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { action: "detectAds", tabUrl: tabs[0].url });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "adDetectionResult") {
      const adResult = message.adResult;
      const freetrialResult = message.freetrialResult;
      const wrong = '<svg class="iconns" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#fa0000" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>';
      const right = '<svg class="iconss" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 448 512"><path fill="#009912" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>';
      const adStatus = adResult ? (right + 'Ads detected!') : (wrong + ' No ads detected.');
      const freetrialStatus = freetrialResult ? (right + ' Detected') : (wrong + ' Not Detected.');

      const adsResultElement = document.getElementById("ads_result");
      const statusElement = document.getElementById("trials_result");

      adsResultElement.innerHTML = '';
      statusElement.innerHTML = '';
      const adsTempContainer = document.createElement("div");
      const freetrialTempContainer = document.createElement("div");
      adsTempContainer.innerHTML = adStatus;
      freetrialTempContainer.innerHTML = freetrialStatus;
      while (adsTempContainer.firstChild) {
          adsResultElement.appendChild(adsTempContainer.firstChild);
      }

      while (freetrialTempContainer.firstChild) {
          statusElement.appendChild(freetrialTempContainer.firstChild);
      }
  }
});
document.getElementById("scanButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
          tabs[0].id,
          {
              action: "scanButton",
              tabUrl: tabs[0].url
          },
          (response) => {
              if (chrome.runtime.lastError) {
                  document.getElementById("datadisplay").textContent =
                      "Error: " + chrome.runtime.lastError.message;
                  return;
              }else{
              console.log("hi" + response.procdata);}
              // Check if response contains data property
              if (response?.data) {
                  document.getElementById("datadisplay").textContent = response.data.join("\n");
              } else {
                  document.getElementById("datadisplay").textContent = "No data received.";
              }
          }
      );
  });
});

