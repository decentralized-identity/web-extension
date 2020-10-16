
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

  WebExtensionFrame = class WebExtensionFrame {
    constructor(url, options = {}){
      let element = this.element = document.createElement('iframe');
      element.id = options.id;
      element.name = this.uuid = uuid();
      this.src = url;
    }
    get src() {
      return this._src;
    }
    set src(url) {
      this.element.src = this._src = url.startsWith('chrome-extension://') ? url : browser.runtime.getURL(url);
    }
    get name(){
      return this.element.name = this.uuid;
    }
  };

  skipAnimationFrame = fn => requestAnimationFrame(() => requestAnimationFrame(fn));

  window.delegateEvent = function delegateEvent(type, selector, fn, options = {}){
    let listener = e => {
      let match = e.target.closest(selector);
      if (match) fn(e, match);
    }
    (options.container || document).addEventListener(type, listener, options);
    return listener;
  }

  let environment = (() => {
    var extension = window.browser && window.browser.extension;
    if (extension && extension.getBackgroundPage) {
      return extension.getBackgroundPage() === window ? 'background' : 'frame';
    }
    else return !extension || !extension.onMessage ? 'page' : 'content';
  })();
  let extensionOrigin = environment !== 'page' && browser.runtime.getURL('').replace(/\/+$/, '');

  // let log = console.log;
  // console.log = function(){
  //   let args = [` --- ${environment.toUpperCase()} ---`, '\n'];
  //   Array.prototype.forEach.call(arguments, arg => {
  //     args.push('\n');
  //     args.push('\xa0');
  //     args.push(arg);
  //   });
  //   args.push('\n');
  //   args.push('\n');
  //   log.apply(console, args);
  // }

  window.EXT = {
    _messageHandlers: {},
    _messageRequests: {},
    _frame: uuid(),
    uuid: uuid,
    ports: {},
    environment: environment,
    addMessageHandlers(handlers){
      Object.assign(EXT._messageHandlers, handlers);
    },
    messageBackground(message){
      connectBackground();
      EXT.backgroundPort.postMessage(message)
    },
    sendMessage(config = {}, port = null){
      /*
          message = {
            id: uuid(),
            type: 'prompt',
            to: 'background'
            props: {...},
            callback: function(){}
          }
      */
      let message = Object.assign({
        id: uuid(),
        origin: environment
      }, config, { from: environment });

      if (message.callback || message.error) {
        EXT._messageRequests[message.id] = {
          callback: message.callback,
          error: message.error
        }
        delete message.callback;
        delete message.error;
      }

      if (message.type === 'frame_to_content') console.log(76, message);
      
      if (environment === 'page') {
        let win = window;
        if (message.frame) {
          let iframe = document.querySelector(`iframe[name="${message.frame}"]`);
          win = iframe ? iframe.contentWindow : null;
        }
        if (win) win.postMessage(JSON.stringify(message), '*');
        else console.error('No matching frame for message: ', message);
      }
      else if (environment === 'frame'){
        message.frame = window.name;
        if (message.to === 'page') {
          if (window.parent) window.parent.postMessage(JSON.stringify(message), '*');
        }
        else if (message.to === 'content') EXT.self.then(self => {
          let port = browser.tabs.connect(self.tab.id);
          port.onMessage.addListener(message => handleMessage(message))
          port.postMessage(message);
        });
        else if (message.to === 'background') EXT.messageBackground(message);
        
        // else throw `This context has no associated ${message.to} environment to message`;   
      }
      else if (environment === 'content') {
        if (message.to === 'page') {
          message.untrusted = false;
          postMessage(JSON.stringify(message), '*');
        }
        else if (message.to === 'background') EXT.messageBackground(message);
        else if (message.to === 'frame' && message.frame) {
          console.log(port);
          port.postMessage(message);
        }
      }
      else if (environment === 'background') {
        if (port) port.postMessage(message);
        else {
          for (let id in EXT.ports) {
            EXT.ports[id].postMessage(message);
          }
        }
      }
      else EXT.messageBackground(message);
    }
  };

  EXT.self = new Promise(resolve => {
    if (environment === 'page') return resolve(null);
    EXT.sendMessage({
      type: 'get_self',
      to: 'background',
      callback: tab => resolve(tab)
    });
  });

  function connectBackground(){
    if (!EXT.backgroundPort) {
      EXT.backgroundPort = browser.runtime.connect();
      EXT.sendMessage({ type: 'connect-content-port', to: 'background' });
    }
  }

  function handleMessage(message, port){
    if (message.origin !== environment) { // Not callback
      if (message.to === environment) {
        let handler = EXT._messageHandlers[message.type];
        if (handler) {
          try {
            if (message.untrusted && !handler.untrusted) throw 'Access Denied: message from disallowed context';
            if (handler.action) message.response = handler.action(message.props, port ? port.sender : null);
          }
          catch (e) { message.error = e }
        }
        message.to = message.origin;
        EXT.sendMessage(message, port || null);
      }
    }
    else { // Is callback
      let request = EXT._messageRequests[message.id];
      if (request && message.origin === environment) {
        if (message.error) {
          if (request.error) request.error(message.error)
        }
        else if (request.callback) request.callback(message.response);
        delete EXT._messageRequests[message.id];
      }
    }
  }

  function parseJSON(z) {
    try { var json = JSON.parse(z || null) } catch(e) {}
    return json;
  }

switch (environment) {

  case 'page':

      window.addEventListener('message', function(e) {
        let message = parseJSON(e.data);
        if (message && (e.source === window || (message.frame && document.querySelector(`iframe[name="${message.frame}"]`)))){
          if (message.from !== 'page') handleMessage(message);
        }
      });

      break;


  case 'frame':
  case 'content':

      connectBackground();
      EXT.backgroundPort.onMessage.addListener((message, port) => handleMessage(message, port));

      browser.runtime.onConnect.addListener(port => {
        port.onMessage.addListener((message, port) => handleMessage(message, port));
      })

      window.addEventListener('message', function(e) {
        let message = parseJSON(e.data);
        if (message) {
          if (e.source === window || e.source === window.parent) {
            message.from = 'page';
            message.untrusted = true;
            handleMessage(message);
          }
          if (e.source === window && environment === 'content' && message.to === 'background') {
            EXT.sendMessage(message);
          }
        }
        
      }); 

      break;


  case 'background':

      EXT.addMessageHandlers({
        'get_self': {
          action: (props, sender) => sender
        }
      });
  
      browser.runtime.onConnect.addListener(port => {
        let id = port.sender.frameId;
        EXT.ports[id] = port;
        port.onMessage.addListener((message, port) => handleMessage(message, port));
        port.onDisconnect.addListener(() => delete EXT.ports[id])
      });

      break;

}

})();