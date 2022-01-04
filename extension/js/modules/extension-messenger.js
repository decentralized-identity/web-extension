
import { UUID } from '/extension/js/modules/uuid.js';

const Listeners = {};
const Callbacks = {};
const baseUrl = chrome?.runtime?.getURL ? chrome.runtime.getURL('') : '';
const env = location.href === (baseUrl + 'extension/background.js') ? 'background' : baseUrl ? 'content' : 'page';

const getListeners = topic => Listeners[topic] || (Listeners[topic] = []);

function handleMessage(message){
  if (!message.__did_ext__) return;
  if (message.to === env) {
    if ('response' in message) {
      let callback = Callbacks[message.id];
      if (callback) {
        callback(message.response);
        delete Callbacks[message.id];
      }
    }
    else {
      getListeners(message.topic).forEach(async fn => {
        let response = await fn(message);
        if (message.expectResponse && (message.from === 'page' ? response !== undefined : true)) {
          delete message.expectResponse;
          ExtensionMessenger.send(Object.assign({}, message, {
            to: message.from,
            from: message.to,
            response: response
          }))
        }
      })
    }
  }
  else if (message.from !== env) {
    ExtensionMessenger.send(message);
  }
}

if (env === 'background') {
  chrome.runtime.onMessage.addListener((message, sender) => {  // Listen for messages sent up by Content
    if (sender?.tab?.id) {
      message.tabs = message.tabs || [];
      message.tabs.push(sender.tab.id);
    }
    else delete message.tabs;
    handleMessage(message);
  });
}

else if (env === 'content') {
  chrome.runtime.onMessage.addListener(message => {  // Listen for messages sent down by Background
    handleMessage(message);
  });

  window.addEventListener('message', event => {  // Listen for messages sent up by Page
    let message = event.data;
    if (message.from === 'background' || message.from === 'content') return;
    message.from = 'page';
    message.origin = event.origin;
    handleMessage(message);
  }, false);
}

else if (env === 'page') {
  window.addEventListener('message', event => {  // Listen for messages sent down by Content
    let message = event.data;
    if (message.from === 'page') return;
    handleMessage(message);
  }, false);
}

const ExtensionMessenger = {
  env: env,
  send (params = {}) {

    let message = {
      __did_ext__: true,
      id: params.id || UUID.v4(),
      topic: params.topic,
      to: params.to,
      from: params.from || env,
      data: params.data,
      expectResponse: params.expectResponse,
    }
    if ('response' in params) message.response = params.response;
    if (params.origin) message.origin = params.origin;
    if (params.callback && params.from !== 'background') {
      message.expectResponse = true;
      Callbacks[message.id] = params.callback;
    }

    if (env === 'background') {
      if (message.to === 'content' || message.to === 'page') {
        if (params.tabs) {
          params.tabs.forEach(tabId => chrome.tabs.sendMessage(tabId, message, { frameId: 0 },))
        }
        else {
          chrome.tabs.query({ url: ['http://*/*', 'https://*/*', 'data://*/*'] }, tabs => {
            tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, message, { frameId: 0 })
            });
          });
        }
      }
    }
    else if (env === 'content') {
      if (message.to === 'background') chrome.runtime.sendMessage(message);
      else if (message.to === 'page') postMessage(message, location.origin);
    }
    else if (env === 'page') postMessage(message, location.origin);
  },
  addListener (topic, fn) {
    let listeners = getListeners(topic);
    if (!listeners.includes(fn)) listeners.push(fn);
  },
  removeListener (topic, fn) {
    if (!fn) delete Listeners[topic];
    else {
      let listeners = getListeners(topic);
      let index = listeners.indexOf(fn);
      if (index !== -1) listeners.splice(index, 1);
    }
  }
}

export { ExtensionMessenger };