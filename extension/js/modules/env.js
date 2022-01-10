
const baseUrl = chrome?.runtime?.getURL ? chrome.runtime.getURL('') : '';
const context = location.href === (baseUrl + 'extension/background.js') ? 'background' : baseUrl ? 'content' : 'page';

const Env = {
  baseUrl,
  context
}

export { Env }