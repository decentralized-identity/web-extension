
import UUID from './uuid.mjs';

const baseUrl = chrome?.runtime?.getURL ? chrome.runtime.getURL('') : '';
const env = location.href === (baseUrl + 'extension/background.mjs') ? 'background' : baseUrl ? 'content' : 'page';

const Responses = {};
function generateMessage(params){
  let message = {
    id: params.id || UUID.v4(),
    topic: params.topic,
    to: params.to,
    from: params.env || env,
    data: params.data
  }
  if (params.expectResponse) {
    message.expectResponse = true;
    Responses[message.id] = message;
  }
  return message;
}

const Listeners = {};
function getListeners(topic){
  return Listeners[topic] || (Listeners[topic] = []);
}

if (env === 'background') {
  chrome.runtime.onMessage.addListener(message => {  // Listen for messages sent up by Content
    console.log(env, message);
  });
}

else if (env === 'content') {
  chrome.runtime.onMessage.addListener(message => {  // Listen for messages sent down by Background
    console.log(env, message);
  });

  window.addEventListener('message', event => {  // Listen for messages sent up by Page
    console.log(env, event.data);
    let params = event.data;
    params.from = 'page';
    params.origin = event.origin;
    ExtensionMessenger.send(params);
  }, false);
}

else if (env === 'page') {
  window.addEventListener('message', event => {  // Listen for messages sent down by Content
    let message = event.data;
    if (message.from === 'page' && !('response' in message)) return;
    console.log(env, event.data);
  }, false);
}


const ExtensionMessenger = {
  env: env,
  send (params = {}) {
    if (env === 'background') {
      chrome.runtime.sendMessage(generateMessage(params));
    }
    if (env === 'content') {
      chrome.runtime.sendMessage(generateMessage(params));
    }
    if (env === 'page') {
      window.postMessage(generateMessage(params), location.origin);
    }
  },
  addListener (topic, fn) {
    let listeners = getListeners(topic);
    if (!listeners.includes(fn)) listeners.push(fn);
  },
  removeListener (topic, fn) {
    let listeners = getListeners(topic);
    let index = listeners.indexOf(fn);
    if (index !== -1) listeners.splice(index, 1);
  }
}

export default ExtensionMessenger;