
import uuid from '/extension/js/modules/uuid.js';
import DID from '/extension/js/modules/did.js';
import DOM from '/extension/js/modules/dom.js';
import Data from '/extension/js/modules/data.js';
import RenderList from '../../js/web-components/render-list.js';

let requestConfig = new Promise((resolve, reject) => {
  EXT.sendMessage({
    type: 'credential_offer_config',
    to: 'content',
    callback: config => resolve(config),
    error: error => reject(error)
  });
});

function respond(status) {
  EXT.sendMessage({
    type: 'credential_offer_response',
    to: 'content',
    props: { status: status }
  });
}

DOM.delegateEvent('pointerup', '[action]', async (e, delegate) => {
  let config = await requestConfig;
  await DID.createPeerDID(config.uri);
  let status = delegate.getAttribute('action');
  if (status === 'accepted') {
    try {
      await Data.storeObject(config.uri, config.vc)
    }
    catch (e) {
      status = 'rejected';
    }
  }
  respond(status);
})

block_credential_offers.addEventListener('click', async e => {
  let config = await requestConfig;
  DID.updateConnection(config.uri, {
    permissions: {
      credential_offers: false
    }
  });
  respond('rejected');
});