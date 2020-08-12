

(function(){

  var currentTab = invokeIntent('getCurrentTab');

  getConfiguration().then(c => {
    console.log(c);

    currentTab.then(tab => {
      invokeIntent('setActionState', {
        tabId: tab.id,
        state: 'pending'
      });
      setTimeout(() => {
        invokeIntent('setActionState', {
          tabId: tab.id,
          state: 'confirmed'
        });
      }, 3000)
    });
  }).catch(e => {
    //currentTab.then(tab => invokeIntent('disableAction', tab.id));
  });


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