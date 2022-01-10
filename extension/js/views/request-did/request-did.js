

import { DID} from '/extension/js/modules/did.js';
import { DOM } from '/extension/js/modules/dom.js';
import { UUID } from '/extension/js/modules/uuid.js';
import { Browser } from '/extension/js/modules/browser.js';
import { RenderList } from '/extension/js/compiled/web-components.js';
import { ExtensionMessenger as Messenger } from '/extension/js/modules/extension-messenger.js';

let tabData = await Browser.content.getTabData();
let message = tabData.message;

DOM.queryAll('.connection-origin').forEach(node => node.textContent = message.origin);

create_pairwise_button.addEventListener('pointerup', async e => {
  let message = tabData.message;
  let methods = tabData?.methods || ['ion'];
  let peer = await DID.createPeerDID(message.origin, { method: methods.includes('ion') ? 'ion' : 'key' });
  let nonce = UUID.v4();
  globalThis.popupResult = {
    did: peer.did,
    nonce: nonce,
    signature: await DID.sign(peer.did, (message.challenge || 123) + nonce)
  }
  console.log(message);
  await Messenger.respond(message, globalThis.popupResult);
  window.close();
});

block_did_requests.addEventListener('click', async e => {
  // DID.updateConnection(config.uri, {
  //   permissions: {
  //     did_request: false
  //   }
  // });
});