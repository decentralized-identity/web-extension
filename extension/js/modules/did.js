
import { Natives } from '/extension/js/modules/natives.js';
import { Storage } from '/extension/js/modules/storage.js';
import { UUID } from '/extension/js/modules/uuid.js';
import DIDMethods from '/extension/js/did-methods/config.mjs';
import '/extension/js/did-methods/ion/ion.js';

// import {
//   JsonWebKey,
//   JsonWebSignature
// } from '/node_modules/@transmute/json-web-signature/dist/json-web-signature.esm.js';
// import { verifiable } from '/node_modules/@transmute/vc.js/dist/vc.js.esm.js';


let PeerModel = {
  permissions: {}
};

let createConnection = (uri, options) => {
  let entry = JSON.parse(JSON.stringify(PeerModel));
  entry.id = uri;
  return entry;
}

async function getMethod(method){
  return (await import(`../did-methods/${method}/index.js`)).default
}

const DID = {
  supportedMethods: Object.keys(DIDMethods.supportedMethods),
  async create (options = {}){
    let module = await getMethod(options.method || 'ion');
    let did = await module.create();
    if (options.persona) did.persona = options.persona.trim();
    if (options.icon) did.icon = options.icon;
    await Storage.set('dids', did);
    return did;
  },
  async createPeerDID (uri, options = {}){
    // let { protocol, pathname } = new URL(uri);
    // uri = protocol + pathname;
    let entry = await Storage.get('connections', uri) || createConnection(uri);
    if (entry.did) {
      return entry;
    }
    entry.did = (await this.create(options.method)).id;
    await Storage.set('connections', entry);
    return entry;
  },
  async get(didUri){
    return Storage.find('dids', [
      ['equivalentIds', 'INCLUDES', didUri]
    ]).then(rows => rows[0])
  },
  async getPersonas(){
    return Storage.find('dids', did => !!did.persona)
  },
  async getConnection (uri, options = {}){
    return await Storage.get('connections', uri);
  },
  async setConnection (obj){
    await Storage.set('connections', obj);
  },
  async updateConnection (uri, obj){
    return await Storage.modify('connections', uri, (entry, exists) => {
      Natives.merge(entry, exists ? entry : createConnection(uri), obj);
    });
  },
  async resolve(didUri){
    let method = await getMethod(didUri.split(':')[1]);
    return method.resolve(didUri);
  },
  async sign(didUri, message){
    let did = await this.get(didUri);
    let method = await getMethod(didUri.split(':')[1] || 'ion');
    return {
      id: did.keys.signing.id,
      signature: method.sign(did.keys.signing.privateKey, message)
    }
  },
  async verify(didUri, message){
    let did = await this.get(didUri);
    let method = await getMethod(didUri.split(':')[1] || 'ion');
    method.verify(did, message);
  },
  async createCredential(didUri, credential){
    let did = await DID.get(didUri);
    const result = await verifiable.credential.create({
      credential: Object.assign({
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://w3id.org/security/suites/jws-2020/v1',
        ],
        id: 'urn:uuid:' + UUID.v4(),
        type: ['VerifiableCredential'],
        issuer: {
          id: did.canonicalId
        },
        issuanceDate: new Date().toISOString()
      }, credential),
      format: ['vc', 'vc-jwt'],
      documentLoader: url => {
        return DID.resolve(url);
      },
      suite: new JsonWebSignature({
        key: await JsonWebKey.from({
          id: did.canonicalId + did.keys.signing.id,
          type: 'JsonWebKey2020',
          controller: did.canonicalId,
          publicKeyJwk: did.keys.signing.publicKey,
          privateKeyJwk: did.keys.signing.privateKey
        })
      }),
    });
    console.log(result);
  }
}

export { DID };