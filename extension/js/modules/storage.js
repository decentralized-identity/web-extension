
import Natives from '/extension/js/modules/natives.js';

var storage = browser.storage.sync;
var storageMethods = {
  get (key){
    return storage.get(key).then(obj => obj[key]);
  },
  getAll (keys){
    return storage.get(Array.isArray(keys) ? keys : arguments);
  },
  set (key, value){
    let item = key;
    if (arguments.length > 1) item = { [key]: value };
    return storage.set(item);
  },
  assign(key, newObj){
    return this.get(key).then(currentObj => {
      this.set(key, Object.assign(currentObj || {}, newObj));
    })
  },
  merge(key, newObj){
    return this.get(key).then(currentObj => {
      this.set(key, Natives.merge(currentObj || {}, newObj));
    })
  },
  contains (key){
    return this.get(key).then(o => !!Object.keys(o).length);
  },
  remove (keys){
    return storage.remove(Array.isArray(keys) ? keys : arguments.length > 1 ? arguments : keys);
  },
  clear() {
    return storage.clear();
  }
}

globalThis.EXT = Object.assign(globalThis.EXT || {}, { storage: storageMethods });

export default storageMethods;