

import './ion.js';

export default {
  name: 'ion',
  getBaseId(did){
    return did.split(':').slice(0, 3).join(':');
  },
  async create(options = {}){
    let signingKeys = await ION.generateKeyPair('Ed25519');
    let signing = {
      id: options?.keys?.signing?.id || '#sign',
      type: 'jwk',
      publicKey: signingKeys.publicJwk,
      privateKey: signingKeys.privateJwk
    };

    let encryptionKeys = await ION.generateKeyPair('Ed25519');
    let encryption = {
      id: options?.keys?.encryption?.id || '#encrypt',
      type: 'jwk',
      publicKey: encryptionKeys.publicJwk,
      privateKey: encryptionKeys.privateJwk
    };

    let did = new ION.DID({
      content: {
        publicKeys: [
          {
            id: signing.id.split('#')[1] || signing.id,
            type: 'JwsVerificationKey2020',
            publicKeyJwk: signingKeys.publicJwk,
            purposes: [ 'authentication' ]
          },
          {
            id: encryption.id.split('#')[1] || encryption.id,
            type: 'JwsVerificationKey2020',
            publicKeyJwk: encryptionKeys.publicJwk,
            purposes: [ 'keyAgreement' ]
          }
        ]
      }
    });

    let longForm = await did.getURI('long');
    let shortForm = await did.getURI('short');

    return {
      id: shortForm,
      canonicalId: longForm,
      equivalentIds: [shortForm, longForm],
      keys: {
        signing: signing,
        encryption: encryption
      },
      state: await did.getAllOperations()
    }
    
  },
  async operation(){

  },
  async resolve (did){
    return ION.resolve(did);
  },
  async sign (privateJwk, message){
    return ION.signJws({
      payload: message,
      privateJwk: privateJwk
    });
  },
  async verify (privateJwk, message){

  }
}