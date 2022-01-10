
import { Env } from '/extension/js/modules/env.js';
import { UUID } from '/extension/js/modules/uuid.js';
import { Browser } from '/extension/js/modules/browser.js';

let tabId;
const env = Env.context;
const Promises = {};
const Listeners = {};
const getListeners = topic => Listeners[topic] || (Listeners[topic] = []);

if (env === 'background' || env === 'content') {
  chrome.runtime.onMessage.addListener((message, sender) => {  // Listen for messages sent Content <> Background
    if (sender?.tab?.id) message.tab = sender.tab.id;
    fireListeners(message, sender);
  });
  chrome.storage.onChanged.addListener(changes => {
    for (let key in changes) {
      let message = changes[key].newValue;
      if (message) resolveResponses(message);
    }
  })
}

if (env === 'content') {
  window.addEventListener('message', async event => {  // Listen for messages sent up by Page
    let message = event.data;
    if (message.from !== 'page' || 'response' in message) return;
    message.tab = tabId ? tabId : tabId = await Browser.content.getTabId();
    message.origin = event.origin;
    fireListeners(message, event);
  }, false);
}

else if (env === 'page') {
  window.addEventListener('message', event => {  // Listen for responses sent down by Content
    resolveResponses(event.data);
  }, false);
}

function fireListeners(message, event){
  if (!message.__did_ext__) return;
  if (message.from !== env) {
    if (env === 'content' && message.from === 'page') {
      tabId = tabId || await Browser.content.getTabId();
      if (message.tab === tabId) postMessage(message);
    }
    getListeners(message.topic).forEach(async fn => {
      let response = await fn(message, event);
      if (response !== undefined) {
        ExtensionMessenger.respond(message, response);
      }
    })
  }
}

async function resolveResponses (message){
  if (!message.__did_ext__) return;
  if ('response' in message){
    if (env === 'content' && message.from === 'page') {
      tabId = tabId || await Browser.content.getTabId();
      if (message.tab === tabId) postMessage(message);
    }
    else {
      let resolve = Promises[message.id];
      if (resolve) {
        resolve(message.response);
        delete Promises[message.id];
        //if (env !== 'page') Browser.localStorage.remove('messages:' + message.id);
      }
    }
  }
}

const ExtensionMessenger = {
  send: function send(params){
    let message = {
      __did_ext__: true,
      id: params.id || UUID.v4(),
      topic: params.topic,
      to: params.to,
      from: params.from || env,
      data: params.data
    }

    if (params.origin) message.origin = params.origin;
    if ('response' in params) message.response = params.response;
    if (params.callback) {
      message.promise = new Promise(fn => { Promises[message.id] = fn });
    }
    let clonedMessage = JSON.parse(JSON.stringify(message));
    if (message.to === 'content' && env === 'page' || message.to === 'page' && env === 'content') {
      postMessage(clonedMessage);
    }
    else if (message.to === 'background' && env === 'content') {
      if (env === 'page' || env === 'background') throw `Background cannot be messaged by ${ env === 'page' ? 'pages' : 'itself' }`;
      else chrome.runtime.sendMessage(clonedMessage);
    }
    else if (typeof message.to === 'number') {
      if (env === 'page') throw 'Pages cannot message tabs';
      else chrome.tabs.sendMessage(message.to, clonedMessage, { frameId: 0 })
    }

    return message;
  },
  respond: async function respond (message, response){
    message.response = response === undefined ? null : response;
    tabId = tabId || await Browser.content.getTabId();
    if (message.from !== 'background') {
      if (message.tab === tabId) postMessage(message);
      else chrome.tabs.sendMessage(message.tab, message, { frameId: 0 })
    }
    else chrome.runtime.sendMessage(message);
    //await Browser.localStorage.set('messages:' + message.id, message);
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