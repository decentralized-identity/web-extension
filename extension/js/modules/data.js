
import canonicalize from '/extension/js/modules/canonical-json.js';
import {JSONPath} from '/extension/js/modules/jsonpath.js';
import Storage from '/extension/js/modules/storage.js';
import Natives from '/extension/js/modules/natives.js';
import SemanticRenderer from '/extension/js/modules/semantic-renderer.js';

const SHA256 =  new Hashes.SHA256;
const colonSlashReplaceRegex = /:*\/+/g;
let sheets = {};
let templates = {};
export default {
  getObjectId(obj){
    return obj.id && obj.id.toLowerCase();
  },
  getTypeKey(obj){
    let uri = obj.credentialSchema && obj.credentialSchema.id;
    return uri ? uri.toLowerCase().replace(colonSlashReplaceRegex, '—') : null;
  },
  async storeObject(origin, obj, merge){
    let id = this.getObjectId(obj);
    if (!id) throw 'DataError: all objects must include an id property';
    let type = this.getTypeKey(obj);
    if (!type) throw 'DataError: all objects must include a credentialSchema object with a schema id';
    Storage.modify('data', id, (entry, exists) => {
      let current = exists ? entry : {
        id: id,
        type: type,
        origin: origin,
        data: obj
      };
      if (merge) {
        Natives.merge(current, { data: obj });
      }
      else current.data = obj;
      return current;
    })
  },
  async getObject(id){
    return Storage.get('data', id);
  },
  async getObjectsByType(type){
    return Storage.query('data', 'type').equalsIgnoreCase(type).toArray();
  },
  async getDataViewTemplate(type){ // delimiter: —
    if (typeof type === 'object') type = this.getTypeKey(type);
    if (templates[type]) return templates[type]
    else {
      let template = templates[type] = await import('/extension/views/data-viewer/templates/' + type + '/template.js')
      .then(module => module.default)
      .catch(e => {
        console.log(e);
        return e;
      });
      template.type = type;
      template.styles = '/extension/views/data-viewer/templates/' + type + '/template.css';
      return template;
    }
  },
  async renderDataView(data, view, options = {}){
    let type = this.getTypeKey(data);
    let template;
    try {
      template = await this.getDataViewTemplate(type);
      if (template.styles && globalThis.document && !options.injectStyles && !sheets[template.styles]) {
        let sheet = document.createElement('link');
        sheet.rel = 'stylesheet';
        sheet.href = template.styles;
        document.head.appendChild(sheet);
        sheets[template.styles] = true;
      }
    }
    catch (e) { return e; }
    return SemanticRenderer.render(data, template, view, options)
  }
}