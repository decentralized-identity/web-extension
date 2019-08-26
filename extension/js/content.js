

(function(){
  
  let scripts = [
    'extension/js/intents.js',
    'extension/js/page.js',
    'polyfills/navigator.js'
  ].reduce((frag, src) => {
    let script = document.createElement('script');
    script.src = browser.runtime.getURL(src);
    frag.appendChild(script);
    return frag;
  }, document.createDocumentFragment());

  document.documentElement.appendChild(scripts);

})()
