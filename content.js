chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "detectAds") {
      const ul = request.tabUrl;
      const adResult = detectAds();
      const freetrialResult = freetrial();

      chrome.runtime.sendMessage({
          action: "adDetectionResult",
          adResult: adResult,
          freetrialResult: freetrialResult,
          tabUrl: ul,
      });
  }
  });

let processeddataa;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.action === "scanButton") {
      console.log("Received action to getPageData", request);
      let url = request.tabUrl;
      console.log("content url", url);
      try {
          const elements = document.querySelectorAll("body *");
          console.log("Total elements found:", elements.length);

          let pageData = Array.from(elements)
              .filter(
                  (element) =>
                      element.innerText &&
                      element.offsetWidth > 0 &&
                      element.offsetHeight > 0
              )
              .map((element) => element.innerText.trim());

          console.log("Extracted data:", pageData.length);
          for (let i = 0; i < pageData.length; i++) {
              // Replace all special characters
              pageData[i]=pageData[i].replace(/₹/g, '_');
              pageData[i]=pageData[i].replace(/!/g, '_');
              pageData[i]=pageData[i].replace(/@/g, '_');
              pageData[i]=pageData[i].replace(/#/g, '_');
              pageData[i]=pageData[i].replace(/$/g, '_');
              pageData[i]=pageData[i].replace(/%/g, '_');
              pageData[i]=pageData[i].replace(/^/g, '_');
              pageData[i]=pageData[i].replace(/&/g, '_');
              pageData[i]=pageData[i].replace(/\*/g, '_');
          }

          if (pageData.length === 0) {
              console.log("No data extracted from the page.");
          } else {
              console.log("Sending data to background script:", pageData);

              chrome.runtime.sendMessage(
                  {
                      action: "sendDataToServer",
                      data: pageData,
                      url: url,
                  },
                  function (response) {
                      if (chrome.runtime.lastError) {
                          console.error(
                              "Error in sending message to background script:",
                              chrome.runtime.lastError.message
                          );
                      } else {
                          console.log("Response from background script:", response);
                          processeddataa=response;
                      }
                  }
              );
          }
          
          sendResponse({
              status: "Success",
              message: "Data processing completed in content script",
          });
      } catch (error) {
          console.error("Error in content script:", error);
          sendResponse({ status: "Error", message: error.message });
      }

      return true;
  }
});

function detectAds() {
  const adPatterns = ['adsbygoogle', 'google_ad'];
  const potentialAds = document.querySelectorAll(adPatterns.map(pattern => `[class*="${pattern}"], [id*="${pattern}"], [src*="${pattern}"]`).join(','));

  return potentialAds.length > 0;
}

function freetrial() {
  const freetrials = ['freetrial', 'try for free'];
  const potentialFreetrials = document.querySelectorAll(freetrials.map(pattern => `[class*="${pattern}"], [id*="${pattern}"], [src*="${pattern}"],[href*="${pattern}"],[a*="${pattern}"]`).join(','));
  const pageContent = document.documentElement.innerText.toLowerCase();
  let b = 0;
  const autor = ['autorenew', 'autorenewal'];
  for (let i = 0; i < freetrials.length; i++) {
      b = b + pageContent.includes(freetrials[i]);
  }
  let c = 0;
  for (const element of autor) {
      c = c + pageContent.includes(element);
  }

  return potentialFreetrials.length > 0 || (b > 0 && c > 0);
}







