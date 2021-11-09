
import DOM from '/extension/js/modules/dom.js';
import RenderList from '/extension/js/web-components/render-list.js';

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