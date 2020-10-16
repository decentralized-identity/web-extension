
router.filters = [
  {
    path: '/extension/views/dashboard/index.html',
    params: ['view'],
    listener(newState, oldState){
      let view = newState.params.view || 'personas';
      content_panels.open(view);
    }
  }
];

router.setState(location);

window.addEventListener('routechange', e => {
  if (overlay_panels) overlay_panels.close();
});

(async () => {

const extensionURL = browser.runtime.getURL('/');
const iconClasses = await fetch(extensionURL + 'extension/data/font-awesome-personas.json')
                          .then(response => response.json());

persona_create_modal_icons.innerHTML = '<i class="' + iconClasses.join('"></i><i class="') + '"></i>';

delegateEvent('pointerup', '[view-action="close"]', e => {
  console.log(e.path);
  EXT.sendMessage({
    type: 'sidebar_close',
    to: 'content',
    callback: response => {
      
    },
    error: error => {
      console.log(error)
    }
  });
});

delegateEvent('keypress', '.global-search', e => {
  if (e.key === 'Enter') {
    global_search_query.textContent = e.target.value;
    if(content_panels.active !== 'global_search') {
      router.modifyState({
        event: e,
        params: { view: 'global_search' }
      });
    }
  }
});

delegateEvent('pointerup', '.create-persona', e => {
  persona_create_modal.open();
});

delegateEvent('pointerup', '.persona-selection-list li', e => {
  persona_create_modal.open();
});

// persona_create_modal_custom.addEventListener('pointerup', e => {
//   persona_create_modal_custom_form.open();
// });

// persona_create_modal.addEventListener('modalclosed', e => {
//   persona_create_modal_custom_form.close();
// })


})()