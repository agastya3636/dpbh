let allelement=[];
function pagemod(re){
  let len=re.message.length;
  console.log(len);
  
  // Create a new paragraph element
  const pa = document.createElement('p');
  pa.textContent = `ML Model found  ${len} elements in the page`;
  
  // Get the container element to append the new paragraph to
  const container = document.getElementById('container');
  
  // Append the new paragraph to the container
  container.innerHTML = `ML Model found  ${len} dark pattern text in the page`;
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "detectAds") {
      const adResult = detectAds()
      const freetrialResult = freetrial()
      chrome.runtime.sendMessage({
          action: "adDetectionResult",
          adResult: adResult,
          freetrialResult: freetrialResult
      })
  } 
});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
 if (message.action === "noti_per") {
      chrome.runtime.sendMessage({
          action: "notification",
          url: message.tabURL
      }, (response) => {
          if (response) {
              console.log(response);
          }
      })
  } 
});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
if (message.action === "ch_redi") {
      console.log("Redirection content.js");
      chrome.runtime.sendMessage({
          action: "redirection",
          url: message.tabURL
      }, (response) => {
          if (response) {
              console.log(response);
          }
      })
  }
});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
if (message.action === "price-trend") {
      chrome.runtime.sendMessage({
          action: "graph",
          url: message.tabURL
      }, (response) => {
          if (response) {
              console.log(response);
          }
      })
  } 
});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
if (message.action === "ssl") {
      chrome.runtime.sendMessage({
          action: "ssl",
          url: message.tabURL
      }, (response) => {
          if (response) {
              console.log(response);
          }
      })
  } 
 });
 chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
 if (message.action === "mlmodel") {
      let scrap_data=scrap();
      
      console.log(scrap_data)
     
      chrome.runtime.sendMessage({
          action: "mlmodel",
          url: message.tabURL,
          scdata:scrap_data
      }, (response) => {
          if (response) {
              console.log(response);
             pagemod(response)
          }
      })
  } 
 });
 chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
 if (message.action === "permissionresponse") {
      console.log(message.datafromserver);
      const receivedData = message.datafromserver.permission;
      const contentDiv = document.createElement("div")
      contentDiv.id = "content";
      for (const key in receivedData) {
          const permission = receivedData[key]
          const card = document.createElement("div")
          card.classList.add("card");
          const title = document.createElement("h2")
          title.textContent = key + " : " + permission;
          card.appendChild(title);
          contentDiv.appendChild(card);
      }
      const pElement = document.getElementById("p");
      pElement.innerHTML = ''
      pElement.appendChild(contentDiv);
  } 
 });
 chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
   if (message.action === "redirectionresponse") {
      console.log(message.datafromserver);
      const receivedData = message.datafromserver.redirection;
      const contentDiv = document.createElement("div")
      contentDiv.id = "content";
      const card = document.createElement("div")
      card.classList.add("card");
      const title = document.createElement("h2")
      title.textContent = "Redirection : " + receivedData;
      card.appendChild(title);
      contentDiv.appendChild(card);
      const pElement = document.getElementById("p");
      pElement.innerHTML = ''
      pElement.appendChild(contentDiv);
  } 
 });
 chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
 if (message.action === "sslresponse") {
      console.log("Graph response:", message.datafromserver);
      let dataFromServer = message.datafromserver;
      const contentDiv = document.createElement("div")
      contentDiv.id = "content";
      // Add class to the card depending on SSL status
      const a1=dataFromServer.ssl.certificate_data.notAfter;
      const a2=dataFromServer.ssl.certificate_data.authorityInfoAccess;
      const d1=dataFromServer.ssl.whois_info.creation_date;
      const card = document.createElement("div")
          card.classList.add("card");
          const title = document.createElement("h2")
        title.textContent = "SSL Certificate Expiration date: " + a1;
          card.appendChild(title);

          const card1 = document.createElement("div")
          card1.classList.add("card");
          const title1 = document.createElement("h2")
        title1.textContent = "Domain Creation Date: "+d1  ;
          card1.appendChild(title1);

          const card2 = document.createElement("div")
          card2.classList.add("card");
          const title2 = document.createElement("h2")
        title2.textContent ="Authority Information Access:\n"+a2 ;
          card2.appendChild(title2);

          contentDiv.appendChild(card1);
          contentDiv.appendChild(card);
          contentDiv.appendChild(card2);
          const pElement = document.getElementById("p");
          pElement.innerHTML = ''
          pElement.appendChild(contentDiv);
      
  } 
 });
 chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
 if (message.action === "gresponse") {
      console.log("Some other graph response:", message.datafromserver);
      const receivedData = message.datafromserver;
      const contentDiv = document.createElement("div")
      contentDiv.id = "content";
     
      for (const key in receivedData) {
          if(key!="val") {
          const permission = receivedData[key]
          const card = document.createElement("div")
          card.classList.add("card");
          const title = document.createElement("h2")
          title.textContent = key + " : " + permission;
          card.appendChild(title);
          contentDiv.appendChild(card);
          
          }
      }
      const pElement = document.getElementById("p");
      pElement.innerHTML = ''
      pElement.appendChild(contentDiv);
      let data = {
        
        'date': receivedData.val.dates,
        'highest': receivedData.val.highestPrices,
        'lowest': receivedData.val.lowestPrices,
        
        'current': receivedData.val.prices,
        'yAxisTicksMin': receivedData.val.yAxisTicksMin
      };
    console.log(receivedData.val.current);


      const ctx = document.getElementById('myChart').getContext('2d');
    let chart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: data.date,
          datasets: [
              {
                  data: data.current,
                  backgroundColor: 'rgba(0, 128, 255, 0.25)',
                  borderColor: '#0080ff',
                  borderWidth: 1,
                  cubicInterpolationMode: 'monotone',
                  pointRadius: 0,
                  pointHoverRadius: 5,
                  pointHoverBorderWidth: 3,
                  pointBackgroundColor: '#0080ff',
                  pointHoverBorderColor: 'rgba(0, 128, 255, 0.25)',
              },
              {
                  data: data.lowestPrices,
                  borderColor: '#129918',
                  fill: false,
                  pointRadius: 0,
                  pointHoverRadius: 0,
                  borderWidth: 1,
                  borderDash: [4, 3],
              },
              {
                  data: data.highestPrices,
                  borderColor: '#ff4d4d',
                  fill: false,
                  pointRadius: 0,
                  pointHoverRadius: 0,
                  borderWidth: 1,
                  borderDash: [4, 3],
              },
          ],
      },
      options: {
          hover: {
              intersect: false,
          },
          scales: {
              xAxes: [{
                  ticks: {
                      maxTicksLimit: 8,
                  },
                  //gridLines: {
                  //    display: false,
                  //},
              }],
              yAxes: [{
                  ticks: {
                      //beginAtZero: true,
                      min: data.yAxisTicksMin,
                      maxTicksLimit: 6,
                      callback: function (value, index, values) {
                          return '₹' + value;
                      },
                  },
              }]
          },
          tooltips: {
              mode: 'index',
              position: 'custom',
              intersect: false,
              displayColors: false,
              caretPadding: 5,
              cornerRadius: 3,
              backgroundColor: '#0080ff',
              titleFontStyle: 'normal',
              titleMarginBottom: 4,
              bodyFontStyle: 'bold',
              callbacks: {
                  label: function (tooltipItem, data) {
                      return 'Price: ₹' + tooltipItem.value;
                  },
              },
              filter: function (tooltipItem) {
                  return tooltipItem.datasetIndex == 0;
              },
          },
          legend: {
              display: false,
          },
      },
  });
      
    }
  });


function detectAds() {
const adPatterns = ['adsbygoogle', 'google_ad'];
const potentialAds = document.querySelectorAll(adPatterns.map(pattern => `[class*="${pattern}"], [id*="${pattern}"], [src*="${pattern}"]`).join(','));

return potentialAds.length > 0;
}

function freetrial() {
const freetrials = ['freetrial', 'try for free','free_trial', 'tryforfree', 'start free trial', 'join for free', 'free trial', 'join for free', 'Try it free for 30 days', '30-day free trial'];
const potentialFreetrials = document.querySelectorAll(freetrials.map(pattern => `[class*="${pattern}"], [id*="${pattern}"], [src*="${pattern}"],[href*="${pattern}"],[a*="${pattern}"]`).join(','));
const pageContent = document.documentElement.innerText.toLowerCase();
let b = 0;
const autor = ['autorenew', 'autorenewal', 'renew', 'renew automatically', 'subscription will renew automatically', 'Cancel at any time'];
for (const element of freetrials) {
    b = b + pageContent.includes(element);
}
let c = 0;
for (const element of autor) {
    c = c + pageContent.includes(element);
}

return potentialFreetrials.length > 0 || (b > 0 || c > 0);
}





const ignoredElements = ['script', 'style', 'noscript', 'br', 'hr'];

const blockElements = [
'div', 'section', 'article', 'aside', 'nav',
'header', 'footer', 'main', 'form', 'fieldset', 'table'
];

const winWidth = window.innerWidth;
const winHeight = window.innerHeight;
const winArea = winWidth * winHeight;

function getElementArea(element) {
var rect = element.getBoundingClientRect();
return rect.height * rect.width;
}

function getClientRect(element) {
if (element.tagName.toLowerCase() === 'html') {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  return {
    top: 0,
    left: 0,
    bottom: h,
    right: w,
    width: w,
    height: h,
    x: 0,
    y: 0
  };
} else {
  return element.getBoundingClientRect();
}
}

function getBackgroundColor(element) {
var style = window.getComputedStyle(element);
var tagName = element.tagName.toLowerCase();

if (style === null || style.backgroundColor === 'transparent') {
  var parent = element.parentElement;
  return (parent === null || tagName === 'body') ? 'rgb(255, 255, 255)' : getBackgroundColor(parent);
} else {
  return style.backgroundColor;
}
}

function getRandomSubarray(arr, size) {
var shuffled = arr.slice(0),
  i = arr.length,
  temp, index;
while (i--) {
  index = Math.floor((i + 1) * Math.random());
  temp = shuffled[index];
  shuffled[index] = shuffled[i];
  shuffled[i] = temp;
}
return shuffled.slice(0, size);
}

function elementCombinations(arguments) {
var r = [],
  arg = arguments,
  max = arg.length - 1;

function helper(arr, i) {
  for (var j = 0, l = arg[i].length; j < l; j++) {
    var a = arr.slice(0);
    a.push(arg[i][j])
    if (i === max) {
      r.push(a);
    } else
      helper(a, i + 1);
  }
}
helper([], 0);

return r.length === 0 ? arguments : r;
}

function getVisibleChildren(element) {
if (element) {
  var children = Array.from(element.children);
  return children.filter(child => isShown(child));
} else {
  return [];
}
}

function getParents(node) {
const result = [];
while (node = node.parentElement) {
  result.push(node);
}
return result;
}

function isShown(element) {
var displayed = function(element, style) {
  if (!style) {
    style = window.getComputedStyle(element);
  }

  if (style.display === 'none') {
    return false;
  } else {
    var parent = element.parentNode;

    if (parent && (parent.nodeType === Node.DOCUMENT_NODE)) {
      return true;
    }

    return parent && displayed(parent, null);
  }
};

var getOpacity = function(element, style) {
  if (!style) {
    style = window.getComputedStyle(element);
  }

  if (style.position === 'relative') {
    return 1.0;
  } else {
    return parseFloat(style.opacity);
  }
};

var positiveSize = function(element, style) {
  if (!style) {
    style = window.getComputedStyle(element);
  }

  var tagName = element.tagName.toLowerCase();
  var rect = getClientRect(element);
  if (rect.height > 0 && rect.width > 0) {
    return true;
  }

  if (tagName == 'path' && (rect.height > 0 || rect.width > 0)) {
    var strokeWidth = element.strokeWidth;
    return !!strokeWidth && (parseInt(strokeWidth, 10) > 0);
  }

  return style.overflow !== 'hidden' && Array.from(element.childNodes).some(
    n => (n.nodeType === Node.TEXT_NODE && !!filterText(n.nodeValue)) ||
    (n.nodeType === Node.ELEMENT_NODE &&
      positiveSize(n) && window.getComputedStyle(n).display !== 'none')
  );
};

var getOverflowState = function(element) {
  var region = getClientRect(element);
  var htmlElem = document.documentElement;
  var bodyElem = document.body;
  var htmlOverflowStyle = window.getComputedStyle(htmlElem).overflow;
  var treatAsFixedPosition;

  function getOverflowParent(e) {
    var position = window.getComputedStyle(e).position;
    if (position === 'fixed') {
      treatAsFixedPosition = true;
      return e == htmlElem ? null : htmlElem;
    } else {
      var parent = e.parentElement;

      while (parent && !canBeOverflowed(parent)) {
        parent = parent.parentElement;
      }

      return parent;
    }

    function canBeOverflowed(container) {
      if (container == htmlElem) {
        return true;
      }

      var style = window.getComputedStyle(container);
      var containerDisplay = style.display;
      if (containerDisplay.startsWith('inline')) {
        return false;
      }

      if (position === 'absolute' && style.position === 'static') {
        return false;
      }

      return true;
    }
  }

  function getOverflowStyles(e) {
    var overflowElem = e;
    if (htmlOverflowStyle === 'visible') {
      if (e == htmlElem && bodyElem) {
        overflowElem = bodyElem;
      } else if (e == bodyElem) {
        return {
          x: 'visible',
          y: 'visible'
        };
      }
    }

    var ostyle = window.getComputedStyle(overflowElem);
    var overflow = {
      x: ostyle.overflowX,
      y: ostyle.overflowY
    };

    if (e == htmlElem) {
      overflow.x = overflow.x === 'visible' ? 'auto' : overflow.x;
      overflow.y = overflow.y === 'visible' ? 'auto' : overflow.y;
    }

    return overflow;
  }

  function getScroll(e) {
    if (e == htmlElem) {
      return {
        x: htmlElem.scrollLeft,
        y: htmlElem.scrollTop
      };
    } else {
      return {
        x: e.scrollLeft,
        y: e.scrollTop
      };
    }
  }

  for (var container = getOverflowParent(element); !!container; container =
    getOverflowParent(container)) {
    var containerOverflow = getOverflowStyles(container);

    if (containerOverflow.x === 'visible' && containerOverflow.y ===
      'visible') {
      continue;
    }

    var containerRect = getClientRect(container);

    if (containerRect.width == 0 || containerRect.height == 0) {
      return 'hidden';
    }

    var underflowsX = region.right < containerRect.left;
    var underflowsY = region.bottom < containerRect.top;

    if ((underflowsX && containerOverflow.x === 'hidden') || (underflowsY &&
        containerOverflow.y === 'hidden')) {
      return 'hidden';
    } else if ((underflowsX && containerOverflow.x !== 'visible') || (
        underflowsY && containerOverflow.y !== 'visible')) {
      var containerScroll = getScroll(container);
      var unscrollableX = region.right < containerRect.left -
        containerScroll.x;
      var unscrollableY = region.bottom < containerRect.top -
        containerScroll.y;
      if ((unscrollableX && containerOverflow.x !== 'visible') || (
          unscrollableY && containerOverflow.x !== 'visible')) {
        return 'hidden';
      }

      var containerState = getOverflowState(container);
      return containerState === 'hidden' ? 'hidden' : 'scroll';
    }

    var overflowsX = region.left >= containerRect.left + containerRect.width;
    var overflowsY = region.top >= containerRect.top + containerRect.height;

    if ((overflowsX && containerOverflow.x === 'hidden') || (overflowsY &&
        containerOverflow.y === 'hidden')) {
      return 'hidden';
    } else if ((overflowsX && containerOverflow.x !== 'visible') || (
        overflowsY && containerOverflow.y !== 'visible')) {
      if (treatAsFixedPosition) {
        var docScroll = getScroll(container);
        if ((region.left >= htmlElem.scrollWidth - docScroll.x) || (
            region.right >= htmlElem.scrollHeight - docScroll.y)) {
          return 'hidden';
        }
      }

      var containerState = getOverflowState(container);
      return containerState === 'hidden' ? 'hidden' : 'scroll';
    }
  }

  return 'none';
};

function hiddenByOverflow(element) {
  return getOverflowState(element) === 'hidden' && Array.from(element.childNodes)
    .every(n => n.nodeType !== Node.ELEMENT_NODE || hiddenByOverflow(n) ||
      !positiveSize(n));
}

let tagName = element.tagName.toLowerCase();

if (tagName === 'body') {
  return true;
}

if (tagName === 'input' && element.type.toLowerCase() === 'hidden') {
  return false;
}

if (tagName === 'noscript' || tagName === 'script' || tagName === 'style') {
  return false;
}

let style = window.getComputedStyle(element);

if (style == null) {
  return false;
}

if (style.visibility === 'hidden' || style.visibility === 'collapse') {
  return false;
}

if (!displayed(element, style)) {
  return false;
}

if (getOpacity(element, style) === 0.0) {
  return false;
}

if (!positiveSize(element, style)) {
  return false;
}

return !hiddenByOverflow(element);
}

function isInteractable(element) {
function isEnabled(element) {
  let disabledSupportElements = ['button', 'input', 'optgroup', 'option', 'select', 'textarea'];
  let tagName = element.tagName.toLowerCase();

  if (!disabledSupportElements.includes(tagName)) {
    return true;
  }

  if (element.getAttribute('disabled')) {
    return false;
  }

  if (element.parentElement && tagName === 'optgroup' || tagName === 'option') {
    return isEnabled(element.parentElement);
  }

  return true;
}

function arePointerEventsDisabled(element) {
  let style = window.getComputedStyle(element);
  if (!style) {
    return false;
  }

  return style.pointerEvents === 'none';
}

return isShown(element) && isEnabled(element) && !arePointerEventsDisabled(element);
}

function containsTextNodes(element) {
if (element) {
  if (element.hasChildNodes()) {
    let nodes = [];
    for (let cnode of element.childNodes) {
      if (cnode.nodeType === Node.TEXT_NODE) {
        let text = filterText(cnode.nodeValue);
        if (text.length !== 0) {
          nodes.push(text);
        }
      }
    }

    return (nodes.length > 0);
  } else {
    return false;
  }
} else {
  return false;
}
}

function filterText(text) {
return text.replace(/(\r\n|\n|\r)/gm, '').trim();
}

function isPixel(element) {
let rect = element.getBoundingClientRect();
let height = rect.bottom - rect.top;
let width = rect.right - rect.left;

return (height === 1 && width === 1);
}

function containsBlockElements(element, visibility = true) {
for (let be of blockElements) {
  let children = Array.from(element.getElementsByTagName(be));
  if (visibility) {
    for (let child of children) {
      if (isShown(child))
        return true;
    }
  } else {
    return children.length > 0;
  }
}

return false;
}

function isWhitespace(element) {
return (element.nodeType === element.TEXT_NODE &&
  element.textContent.trim().length === 0);
}

function segments(element) {
if (!element) {
  console.log(element)
  return [];
}

var tag = element.tagName.toLowerCase();
if (!ignoredElements.includes(tag) && !isPixel(element) && isShown(element)) {
  if (blockElements.includes(tag)) {
    if (!containsBlockElements(element)) {
      if (allIgnoreChildren(element)) {
        return [];
      } else {
        if (getElementArea(element) / winArea > 0.3) {
          var result = [];

          for (var child of element.children) {
            result = result.concat(segments(child));
          }

          return result;
        } else {
          return [element];
        }
      }
    } else if (containsTextNodes(element)) {
      return [element];
    } else {
      var result = [];

      for (var child of element.children) {
        result = result.concat(segments(child));
      }

      return result;
    }
  } else {
    if (containsBlockElements(element, false)) {
      var result = [];

      for (var child of element.children) {
        result = result.concat(segments(child));
      }

      return result;
    } else {
      if (getElementArea(element) / winArea > 0.3) {
        var result = [];

        for (var child of element.children) {
          result = result.concat(segments(child));
        }

        return result;
      } else {
        return [element];
      }
    }
  }
} else {
  return [];
}
}

function allIgnoreChildren(element) {
if (element.children.length === 0) {
  return false;
} else {
  for (let child of element.children) {
    if (ignoredElements.includes(child.tagName.toLowerCase())) {
      continue;
    } else {
      return false;
    }
  }
  return true;
}
}

function scrap() {
  let elements = segments(document.body);
  let filtered_elements = [];

  for (let element of elements) {
    if (element.innerText) {
      allelement.push(element);
      let text = element.innerText.trim().replace(/\t/g, " ");
      if (text.length > 0) {
        filtered_elements.push(text);
      }
    }
  }
  return filtered_elements;
}

function highlight(data) {
  for(let i in allelements){
      console.log(i);
      for(let j in data)
      {
          if(i.innerText.trim().replace(/\t/g, " ")==data[j])
          {
              i.style.backgroundColor = "yellow";
          }
      }
  }
}
