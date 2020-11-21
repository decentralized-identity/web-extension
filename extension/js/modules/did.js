
import uuid from '/extension/js/modules/uuid.js';
import Natives from '/extension/js/modules/natives.js';
import Storage from '/extension/js/modules/storage.js';
import Extension from '/extension/js/modules/extension.js';

let PeerModel = {
  permissions: {}
};
let createConnection = (uri, options) => {
  let entry = JSON.parse(JSON.stringify(PeerModel));
  entry.id = uri;
  return entry;
}

var testKey = {
  "kty": "EC",
  "crv": "P-256",
  "x": "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
  "y": "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
  "d": "jpsQnnGQmL-YBIffH1136cspYG6-0iY7X1fCE9-E9LI"
}

let methods = {
  async create (method, options = {}){
    switch (method) {
      case 'ion':
      default:
        return {
          id: uuid.generate()
        }
    }
  },
  async createPeerDID (uri, options = {}){
    let entry = await Storage.get('connections', uri) || createConnection(uri);
    if (entry.did) {
      return entry;
    }
    entry.did = await this.create(options.method);
    console.log(entry);
    await Storage.set('connections', entry);
    return entry;
  },
  async getConnection (uri, options = {}){
    let entry = await Storage.get('connections', uri);
    return entry || createConnection(uri);
  },
  async setConnection (obj){
    await Storage.set('connections', obj);
  },
  async updateConnection (uri, obj){
    return await Storage.modify('connections', uri, (entry, exists) => {
      Natives.merge(entry, exists ? entry : createConnection(uri), obj);
    });
  },
  async sign(message){
    let crypt = new Jose.WebCryptographer();
    crypt.setContentSignAlgorithm("ES256");
    var signer = new Jose.JoseJWS.Signer(crypt);
    return await signer.addSigner(testKey).then(async () => await signer.sign(message, null, {}));
  }
}

Extension.connectAPI('module_did', methods);

export default methods;