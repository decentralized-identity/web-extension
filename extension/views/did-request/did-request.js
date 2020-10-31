
import uuid from '/extension/js/modules/uuid.js';
import DID from '/extension/js/modules/did.js';
import DOM from '/extension/js/modules/dom.js';
import PersonaList from '../../js/web-components/persona-list.js';

let getRequestConfig = new Promise((resolve, reject) => {
  EXT.sendMessage({
    type: 'did_request_config',
    to: 'content',
    callback: config => resolve(config),
    error: error => reject(error)
  });
})

var testKey = {
  "kty": "EC",
  "crv": "P-256",
  "x": "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
  "y": "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
  "d": "jpsQnnGQmL-YBIffH1136cspYG6-0iY7X1fCE9-E9LI"
}

create_pairwise_did.addEventListener('pointerup', async e => {
  let config = await getRequestConfig;
  if (!config) return false;
  let peer = await DID.createPeerDID(config.uri);
  let nonce = uuid.generate();
  var cryptographer = new Jose.WebCryptographer();
      cryptographer.setContentSignAlgorithm("ES256");
  var signer = new Jose.JoseJWS.Signer(cryptographer);
  let jws = await signer.addSigner(testKey).then(async () => await signer.sign(config.nonce + nonce, null, {}));
  EXT.sendMessage({
    type: 'did_response',
    to: 'content',
    props: {
      entry: peer.did,
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
  DID.patchPeer(config.uri, {
    permissions: {
      did_request: false
    }
  });
});