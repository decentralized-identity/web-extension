
(function(){

let env = (() => {
  var extension = globalThis.browser && globalThis.browser.extension;
  if (extension && extension.getBackgroundPage) {
    return extension.getBackgroundPage() === globalThis ? 'background' : 'frame';
  }
  else return !extension || !extension.onMessage ? 'page' : 'content';
})();

let origin = env !== 'page' && browser.runtime.getURL('').replace(/\/+$/, '')

function uuid() {
  return crypto.getRandomValues(new Uint8Array(16)).join('');
}

var EXT = globalThis.EXT = {
  _messageHandlers: {},
  _messageRequests: {},
  _framePorts: {},
  _frame: uuid(),
  ports: {},
  environment: env,
  addMessageHandlers(handlers){
    Object.assign(EXT._messageHandlers, handlers);
  },
  removeMessageHandlers(){
    for (let handler of arguments) delete EXT._messageHandlers[handler];
  },
  messageBackground(message){
    connectBackground();
    EXT.backgroundPort.postMessage(message);
  },
  sendMessage(config = {}, port = null){
    /*
        message = {
          id: uuid(),
          frame: FRAME_NAME,
          type: 'prompt',
          to: 'background'
          props: {...},
          callback: function(){}
        }
    */
    let message = Object.assign({
      id: uuid(),
      origin: env
    }, config, { from: env });

    if (message.callback || message.error) {
      EXT._messageRequests[message.id] = {
        callback: message.callback,
        error: message.error
      }
      delete message.callback;
      delete message.error;
    }
    if (env === 'page') {
      postMessage(JSON.stringify(message), '*');
    }
    else if (env === 'frame'){
      message.frame = globalThis.name;
      if (message.to === 'page' || message.to === 'content') {
        browser.tabs.getCurrent().then(tab => {
          let port = browser.tabs.connect(tab.id);
          port.onMessage.addListener(message => handleMessage(message))
          port.postMessage(message);
        });
      }
      else if (message.to === 'background') EXT.messageBackground(message);
      // else throw `This context has no associated ${message.to} environment to message`;   
    }
    else if (env === 'content') {
      
      message.source = JSON.parse(JSON.stringify(location));
      if (message.to === 'page') {
        message.untrusted = false;
        postMessage(JSON.stringify(message), '*');
      }
      else if (message.to === 'background') EXT.messageBackground(message);
      else if (message.to === 'frame' && message.frame) {
        let port = EXT._framePorts[message.frame];
        if (!port) port = EXT._framePorts[message.frame] = [];
        Array.isArray(port) ? port.push(message) : port.postMessage(message);
      }
    }
    else if (env === 'background') {
      if (port) port.postMessage(message);
      else {
        for (let id in EXT.ports) {
          EXT.ports[id].postMessage(message);
        }
      }
    }
    else EXT.messageBackground(message);
  },
  request (options = {}){
    return new Promise((resolve, reject) => {
      EXT.sendMessage(Object.assign(options, {
        callback (){
          resolve(...arguments);
        },
        error (){
          reject(...arguments);
        }
      }));
    });
  }
};



EXT.self = new Promise(resolve => {
  if (env === 'page') return resolve(null);
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

async function handleMessage(message, port){
  if (message.origin !== env) { // Not a callback
    if (message.to === env) { // The message is intended for this environment
      let handler = EXT._messageHandlers[message.type];
      if (handler) {
        try {
          if (message.untrusted && !handler.untrusted) throw 'Access Denied: message from disallowed context';
          if (handler.action) {
            message.response = await handler.action(message, port || null);
          }
        }
        catch (e) { message._error = e }
      }
      message.to = message.origin;
      EXT.sendMessage(message, port || null);
    }
  }
  else { // Is a callback
    let request = EXT._messageRequests[message.id];
    if (request && message.origin === env) { // The callback is for this environment
      if (message._error) {
        if (request.error) request.error(message._error)
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

switch (env) {
  case 'page':

      globalThis.addEventListener('message', function(e) {
        let message = parseJSON(e.data);
        if (message && e.source === globalThis){
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

  case 'content':

      globalThis.addEventListener('message', function(e) {
        let message = parseJSON(e.data);
        if (message) {
          if (e.source === globalThis || e.source === globalThis.parent) {
            message.from = 'page';
            message.untrusted = true;
            handleMessage(message);
          }
          if (e.source === globalThis && env === 'content' && message.to === 'background') {
            EXT.sendMessage(message);
          }
        }
        
      });

      EXT.addMessageHandlers({
        'connect_frame': {
          action: (message, port) => {
            let messages = EXT._framePorts[message.frame];
            EXT._framePorts[message.frame] = port;
            if (messages) messages.forEach(m => EXT.sendMessage(m));
          }
        },
      });
  
  case 'frame':
    
      if (globalThis !== globalThis.top){
        EXT.sendMessage({
          type: 'connect_frame',
          to: 'content',
          props: {
            id: window.name
          },
          error: error => console.log(error)
        });
      }

      break;

  case 'background':

      EXT.addMessageHandlers({
        'get_self': {
          action: (message, sender) => sender
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