

document.addEventListener('click', function(e){
  console.log(e);
});

console.log(navigator);

var navigatorScript = document.createElement('script');
navigatorScript.src = browser.runtime.getURL('polyfills/navigator.js');
document.head.appendChild(navigatorScript);

window.addEventListener("message", function(event) {
  if (event.source == window &&
      event.data &&
      event.data.direction == "from-page-script") {
    alert("Content script received message: \"" + event.data.message + "\"");
  }
});