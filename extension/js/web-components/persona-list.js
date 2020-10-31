
import DOM from '/extension/js/modules/dom.js';
import Storage from '/extension/js/modules/storage.js';
const template = document.createElement('template');
const personaTile = (persona, options = {}) => {
  return `<div persona-id="${persona.did.uri}" ${options.state ? 'persona-state="' + options.state + '"' : ''}>
            <i class="${persona.icon}"></i>
            <h3>${persona.name}</h3>
          </div>`;
}

class PersonaList extends HTMLElement {
  constructor (options = {}) {
    super();
    if (options.autoloadPersonas || this.hasAttribute('autoload-personas')) {
      this.load();
    }
  }
  load (){
    Storage.get('personas').then(personas => {
      this.personas = personas;
      var html = '';
      for (let z in personas) html += personaTile(personas[z]);
      this.innerHTML = html;
      //DOM.fireEvent(this, 'personasloaded');
    })
  }
  add (persona){
    template.innerHTML = personaTile(persona, { state: 'add' });
    this.appendChild(template.content);
  }
};

customElements.define('persona-list', PersonaList)

export default PersonaList;