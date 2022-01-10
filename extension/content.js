
const baseUrl = chrome.runtime.getURL('/extension');

Promise.all([
  import('/extension/js/modules/did.js'),
  import('/extension/js/modules/dom.js'),
  import('/extension/js/modules/uuid.js'),
  import('/extension/js/modules/browser.js'),
  import('/extension/js/modules/extension-messenger.js')
]).then(async modules => {
 
  let pageScript = document.createElement('script');
      pageScript.type = 'module';
      pageScript.src = baseUrl + '/page.js';
      pageScript.async = false;
      document.documentElement.prepend(pageScript);
  
  const DID = modules[0].DID;
  const DOM = modules[1].DOM;
  const UUID = modules[2].UUID;
  const Browser = modules[3].Browser;
  const Messenger = modules[4].ExtensionMessenger;

  Messenger.addListener('requestIdentifier', async message => {
      var peer = await DID.getConnection(message.origin);
      if (false) {
        var nonce = UUID.v4();
        return {
          did: peer.did,
          nonce: nonce,
          signature: await DID.sign(peer.did, message.challenge + nonce)
        }
      }
      else {
        Browser.openWindow({
          url: baseUrl + `/views/request-did/index.html?origin=${message.origin}`,
          width: 500,
          height: 650,
          focused: true,
          closeOnBlur: true,
          tabData: {
            message: message
          }
        });
      }
  });

  
});
