

import DIDMethods from '/extension/js/did-methods/config.js';
import { DID } from '/extension/js/modules/did.js';
import { DOM } from '/extension/js/modules/dom.js';
import { UUID } from '/extension/js/modules/uuid.js';
import { Browser } from '/extension/js/modules/browser.js';
import { RenderList } from '/extension/js/compiled/web-components.js';
import { ExtensionMessenger as Messenger } from '/extension/js/modules/extension-messenger.js';

const tabData = await Browser.content.getTabData();
const message = tabData.message;

async function respond (response){
  await Messenger.respond(message, response);
  window.close();
}

DOM.queryAll('.connection-origin').forEach(node => node.textContent = message.origin);

if (tabData?.response?.identifier) {
  // hide identifier selection if identifier is already connected
 
}
else {
  console.log(tabData);
  // let desiredMethods = message.identifier?.supportedMethods || [];
  // let supportedMethods = desiredMethods.filter(method => DIDMethods.supportedMethods[method]);
  // if (!supportedMethods.length) {
  //   respond({ error: `The DID Methods specified by the caller ${desiredMethods.length ? '(' + desiredMethods.join(', ') + ') ' : ' '}are not supported` })
  // }
}

create_pairwise_button.addEventListener('pointerup', async e => {
  let desiredMethods = message.data.identifier?.supportedMethods || [];
  let supportedMethods = desiredMethods.filter(method => DIDMethods.supportedMethods[method]);
  if (!supportedMethods.length) {
    //console.log(supportedMethods);
    respond({
      error: `The DID Methods specified by the caller ${desiredMethods.length ? '(' + desiredMethods.join(', ') + ') ' : ''}are not supported`
    })
  }
  let peer = await DID.createPeerDID(message.origin, { method: supportedMethods.includes('ion') ? 'ion' : supportedMethods[0] });
  console.log(peer);
  globalThis.popupResult = {
    identifier: {
      did: peer.did,
      signature: await DID.sign(peer.did, (message.data.identifier.challenge || '123'))
    }
  }
  console.log(globalThis.popupResult);
  await respond(globalThis.popupResult);
});

block_did_requests.addEventListener('click', async e => {
  // DID.updateConnection(config.uri, {
  //   permissions: {
  //     did_request: false
  //   }
  // });
});