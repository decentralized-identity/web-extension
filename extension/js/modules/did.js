
import uuid from '/extension/js/modules/uuid.js';
import Natives from '/extension/js/modules/natives.js';
import Storage from '/extension/js/modules/storage.js';

let PeerModel = {
  permissions: {}
};
let generatePeerEntry = () => JSON.parse(JSON.stringify(PeerModel))

export default {
  async create (method, options = {}){
    switch (method) {
      case 'ion':
      default:
        return {
          uri: uuid.generate()
        }
    }
  },
  async createPeerDID (peer, options = {}){
    let ids = await Storage.get('peers');
    let entry = (ids && ids[peer]) || generatePeerEntry();
    if (entry.did) return entry;
    entry.did = await this.create(options.method);
    await Storage.assign('peers', { [peer]: entry })
    return entry;
  },
  async getPeer (peer, options = {}){
    let ids = await Storage.get('peers');
    return (ids && ids[peer]) || generatePeerEntry();
  },
  async setPeer (peer, obj){
    await Storage.assign('peers', { [peer]: obj });
  },
  async patchPeer (peer, obj){
    let ids = await Storage.get('peers');
    return await Storage.assign('peers', {
      [peer]: Natives.merge((ids && ids[peer]) || generatePeerEntry(), obj)
    });
  }
}