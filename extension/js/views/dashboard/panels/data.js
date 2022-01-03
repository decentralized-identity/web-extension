
import {DOM} from '/extension/js/modules/dom.js';
import {Data} from '/extension/js/modules/data.js';
import {RenderList} from '/extension/js/compiled/web-components.js';
import '/extension/js/web-components/schema-form.js';

let style = document.createElement('link');
    style.href = '/extension/css/web-components/schema-form.css';
    style.type = 'text/css';
    style.rel = 'stylesheet';
    document.head.append(style);

DOM.delegateEvent('pointerup', 'li', async (e, li) => {
  let entry = await Data.getObject(li.getAttribute('data-object-id'));  
  let html = await Data.renderDataView(entry.data, 'card', { modal: true });
  data_viewer.innerHTML = html;
  data_viewer.open();
}, { container: data_list });