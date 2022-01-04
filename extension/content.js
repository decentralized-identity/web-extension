
const baseUrl = chrome.runtime.getURL('/extension');

Promise.all([
  import('/extension/js/modules/did.js'),
  import('/extension/js/modules/dom.js'),
  import('/extension/js/modules/uuid.js'),
  import('/extension/js/modules/extension-messenger.js')
]).then(modules => {

  let pageScript = document.createElement('script');
      pageScript.type = 'module';
      pageScript.src = baseUrl + '/page.js';
      pageScript.async = false;
      document.documentElement.prepend(pageScript);
  
  const DID = modules[0].DID;
  const DOM = modules[1].DOM;
  const UUID = modules[2].UUID;
  const Messenger = modules[3].ExtensionMessenger;

  Messenger.addListener('requestIdentifier', async message => {

    var peer = await DID.getConnection(message.origin);
    console.log(peer);
    if (false) {
      var nonce = UUID.v4();
      resolve({
        did: peer.did,
        nonce: nonce,
        signature: await DID.sign(peer.did, message.challenge + nonce)
      })
    }
    else {
      //if (!message.prompt) return reject({ did: null })
      var popup = DOM.popup(baseUrl + '/views/request-did/index.html', {
        title: 'Identity - Connect a DID',
        width: 500,
        height: 650,
        //closeOnBlur: true,
        invocationData: {
          ...message
        },
        onBeforeUnload: e => {
          resolve(popup.returnValue || { did: null })
        }
      })
    }
    console.log('requestIdentifier: ', message);
    return 'did:ion:123';
  });
  
});
