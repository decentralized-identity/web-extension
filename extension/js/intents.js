
(function(){

  function uuid() { // IETF RFC 4122, version 4
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  window.extensionEnvironment = (() => {
    var extension = window.browser && window.browser.extension;
    if (extension && extension.getBackgroundPage) {
      return extension.getBackgroundPage() === window ? 'background' : 'elevated';
    }
    else return !extension || !extension.onMessage ? 'page' : 'content';
  })();

  let extensionIntents = {};

  /* When loaded into a BACKGROUND PAGE */

  if (extensionEnvironment === 'background') {

    window.registerExtensionIntents = function(intents = {}){
      for (let z in intents) {
        extensionIntents[z] = async (args) => intents[z](...args);
      }
    }

    function resolveExtensionIntent(port, data){
      let intent = extensionIntents[data.intent];
      if (intent) {
        intent(data.args).then(function(){
          port.postMessage({
            id: data.id,
            ext: 'did-polyfill',
            from: 'background',
            result: Array.from(arguments)
          });
        });
      }
    }

    browser.runtime.onConnect.addListener(port => {
      port.onMessage.addListener(function(data) {
        resolveExtensionIntent(port, data)
      });
    });

  }

  /* When loaded into a CONTENT SCRIPT, POPUP, or other form of ELEVATED CONTEXT */

  else if (extensionEnvironment === 'elevated' || extensionEnvironment === 'content') {

    let extensionRequests = {};
    let port = browser.runtime.connect();
    port.onMessage.addListener(data => {
      if (data.from === 'background' && data.ext === 'did-polyfill') {
        let promise = extensionRequests[data.id];
        if (promise) {
          delete extensionRequests[data.id];
          promise.resolve(...Array.from(data.result));
        }
      }
    });

    window.extensionRequest = function(intent){
      let id = uuid();
      let resolve;
      let promise = extensionRequests[id] = new Promise(res => resolve = res);
      promise.resolve = resolve;
      port.postMessage({
        id: id,
        ext: 'did-polyfill',
        from: 'content',
        intent: intent,
        args: Array.prototype.slice.call(arguments, 1)
      });
      return promise;
    }

    window.registerExtensionIntents = function(intents = {}){
      for (let z in intents) {
        extensionIntents[z] = async (args) => intents[z](...args);
      }
    }

    function resolveExtensionIntent(data){
      let intent = extensionIntents[data.intent];
      if (intent) {
        intent(data.args).then(function(returned){
          postMessage(JSON.stringify({
            id: data.id,
            ext: 'did-polyfill',
            from: 'content',
            result: Array.from(arguments)
          }), '*');
        });
      }
    }

    // From page.js extensionRequest()
    window.addEventListener('message', function(e) {
      let data = JSON.parse(e.data);
      if (e.source == window && data && data.from === 'page' && data.ext === 'did-polyfill') {
        console.log(data);
        resolveExtensionIntent(data);
      }
    });

  }

  /* When loaded into a PAGE SCRIPT */

  else if (extensionEnvironment === 'page') {

    let extensionRequests = {};
    
    window.extensionRequest = function(intent){
      let id = uuid();
      let resolve;
      let promise = extensionRequests[id] = new Promise(res => resolve = res);
      promise.resolve = resolve;
      postMessage(JSON.stringify({
        id: id,
        ext: 'did-polyfill',
        from: 'page',
        intent: intent,
        args: Array.prototype.slice.call(arguments, 1)
      }), '*');
      return promise;
    }
    
    window.addEventListener('message', function(e) {
      let data = JSON.parse(e.data);
      this.console.log(data, extensionRequests[data.id]);
      if (e.source == window && data && data.from === 'content' && data.ext === 'did-polyfill') {
        let promise = extensionRequests[data.id];
        if (promise) {
          delete extensionRequests[data.id];
          promise.resolve(...Array.from(data.result));
        }
      }
    });
  }

})()
