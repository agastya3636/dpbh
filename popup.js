
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "detectAds", tabUrl: tabs[0].url});
});

document.getElementById('not_per').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
          console.log("popup not_per");
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              action: "noti_per",
              tabURL: tabs[0].url
            },(response) => {
                if (response) {
                  console.log(response);
                  }
              }
          );
        });
});

document.getElementById('ch_redi').addEventListener('click', function(){
  chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
    console.log("popup ch_redi");
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        action:"ch_redi",
        tabURL:tabs[0].url
      },(response)=>{
        if(response)
        {
          console.log(response);
        }
      }
    )
  });
});


document.getElementById('ui_decep').addEventListener('click',function(){
  chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
    
    console.log("ra");
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        action:"mlmodel",
        tabURL:tabs[0].url
      },(response)=>{
        if(response)
        {
          console.log(response);
        }
      }
    )
  });
});

document.getElementById('price-trend').addEventListener('click',function(){
  chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
    console.log("popup graph");
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        action:"price-trend",
        tabURL:tabs[0].url
      },(response)=>{
        if(response)
        {
          console.log(response);
        }
      }
    )
  });
});
document.getElementById('ssl').addEventListener('click',function(){
  chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
    console.log("popup ssl");
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        action:"ssl",
        tabURL:tabs[0].url
      },(response)=>{
        if(response)
        {
          console.log(response);
        }
      }
    )
  });
});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "adDetectionResult") {
      const adResult = message.adResult;
      const freetrialResult = message.freetrialResult;
  
  const wrong = '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 512 512"><path fill="#007a56" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>';
  const right = '<svg xmlns="http://www.w3.org/2000/svg" height="25" width="22.5" viewBox="0 0 448 512"><path fill="#e52e2e" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>';       
      const adStatus = adResult ? ( right ) : ( wrong );
      const freetrialStatus = freetrialResult ? (right) : ( wrong) ;

      const adsResultElement = document.getElementById("ads-value");
      const statusElement = document.getElementById("freetrial-value");
      
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

  // if(message.action === "permissionresponse"){
  //   const receiveddata=(message.datafromserver);
  //   for(const key in receiveddata.permission){
  //     console.log(key, receiveddata.permission[key]);
  //   }
  //   document.getElementById("p").innerHTML = "<div>camera="+message.datafromserver.permission.Camera_permission+"<div>";


  // }
});
