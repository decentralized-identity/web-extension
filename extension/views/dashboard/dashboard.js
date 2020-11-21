
import Router from '/extension/js/modules/router.js';

var panels = {
  personas: false,
  connections: false,
  data: false,
};
async function initializePanel(panel){
  if (panels[panel] === false) {
    let module = panels[panel] = await import(`./panels/${panel}.js`);
    if (module.initialize) await panels[panel].initialize();
  }
}

var scrollPositions = {};

Router.filters = [
  {
    path: '/extension/views/dashboard/index.html',
    params: ['view'],
    async listener(state, oldState){
      let lastView = oldState.params.view || 'personas';
      let currentView = state.params.view || 'personas';
      await initializePanel(currentView);
      content_panels.open(currentView);
      // let currentScroll = { top: scrollY, left: scrollX };
      // let scroll = state.scroll = scrollPositions[currentView] = scrollPositions[currentView] || currentScroll;
      // let lastScroll = scrollPositions[lastView] || {};
      // if (lastScroll.top !== scroll.top || lastScroll.left !== scroll.left) {
      //   history.replaceState(oldState, document.title, oldState.search);
      // }
      // windowScroll({
      //   top: scroll.top,
      //   left: scroll.left,
      //   behavior: 'smooth'
      // });
    }
  }
];

Router.setState(location);

window.addEventListener('routechange', e => {
  if (overlay_panels) overlay_panels.close();
});

nav_toggle.addEventListener('pointerup', e => {
  overlay_panels.open('nav');
});