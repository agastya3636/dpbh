// content.js

// Listen for messages from the extension's background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Check if the message action is "getPageData"
    if (request.action === "getPageData") {
      console.log("Received action to getPageData");
      let url=request.tabUrl
  
      try {
        // Extract data from the current page
        console.log("Getting page data...");
        const elements = document.querySelectorAll("body *");
        console.log("Total elements found:", elements.length);
  
        // Filter and map elements to get non-empty, visible text
        const pageData = Array.from(elements)
          .filter(
            (element) =>
              element.innerText &&
              element.offsetWidth > 0 &&
              element.offsetHeight > 0
          )
          .map((element) => element.innerText.trim());
  
        console.log("Extracted data:", pageData);
  
        // Check if any data is extracted before sending it to the background script
        if (pageData.length === 0) {
          console.log("No data extracted from the page.");
        } else {
          console.log("Sending data to background script:", pageData);
  
          // Send the extracted data to the background script
          chrome.runtime.sendMessage(
            {
              action: "sendDataToServer",
              data: pageData,
              url:url,
            },
            function (response) {
              // Handle the response from the background script
              if (chrome.runtime.lastError) {
                console.error(
                  "Error in sending message to background script:",
                  chrome.runtime.lastError.message
                );
              } else {
                console.log("Response from background script:", response);
                //send response to popup.js?
              }
            }
          );
        }
  
        // Send a success response back to the sender
        sendResponse({
          status: "Success",
          message: "Data processing completed in content script",
        });
      } catch (error) {
        // Handle errors and send an error response
        console.error("Error in content script:", error);
        sendResponse({ status: "Error", message: error.message });
      }
  
      // Ensure that the sendResponse callback is invoked asynchronously
      return true;
    }
  });
  