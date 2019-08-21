

async function modifyHeader(e) {
  e.requestHeaders['DID-Support'] = 1;
  e.requestHeaders['DID-User'] = (await DIDManager.count()) > 0 ? 1 : 0;
  return {requestHeaders: e.requestHeaders};
}

browser.webRequest.onBeforeSendHeaders.addListener(
  modifyHeader,
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders']
);