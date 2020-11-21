
import uuid from '/extension/js/modules/uuid.js';
import DID from '/extension/js/modules/did.js';
import DOM from '/extension/js/modules/dom.js';
import RenderList from '../../js/web-components/render-list.js';

let getRequestConfig = new Promise((resolve, reject) => {
  EXT.sendMessage({
    type: 'did_request_config',
    to: 'content',
    callback: config => resolve(config),
    error: error => reject(error)
  });
})

create_pairwise_did.addEventListener('pointerup', async e => {
  let config = await getRequestConfig;
  if (!config) return false;
  let peer = await DID.createPeerDID(config.uri);
  let nonce = uuid.generate();
  let jws = await DID.sign(config.nonce + uuid.generate())
  EXT.sendMessage({
    type: 'did_response',
    to: 'content',
    props: {
      did: peer.did,
      nonce: nonce,
      jws: jws
    },
    error: error => {
      console.log(error);
      reject(error);
    }
  });
});

block_did_requests.addEventListener('click', async e => {
  let config = await getRequestConfig;
  DID.updateConnection(config.uri, {
    permissions: {
      did_request: false
    }
  });
});