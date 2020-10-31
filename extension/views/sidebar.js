
import DOM from '/extension/js/modules/dom.js';
import PersonaList from '/extension/js/web-components/persona-list.js';

DOM.delegateEvent('pointerup', '[view-action="close"]', e => {

  EXT.sendMessage({
    type: 'sidebar_close',
    to: 'content',
    props: {
      name: window.name
    },
    error: error => {
      console.log(error)
    }
  });

})