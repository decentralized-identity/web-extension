

(function(){

window.router = Object.assign({
  initialized: false,
  last: {
    __state__: true,
    href: location.href,
    origin: location.origin,
    path: null,
    search: '',
    params: {}
  },
  filters: [
    // {
    //   path: '',
    //   params: ['foo', 'bar']
    // }
  ],
  generateState(location){
    return {
      __state__: true,
      href: location.href,
      origin: location.origin,
      path: location.pathname,
      search: location.search,
      params: Object.fromEntries(new URLSearchParams(location.search))
    }
  },
  modifyState(options = {}) {
    let state = new URL(location.href);
    state.pathname = options.path || location.pathname;
    if (options.params) {
      let params = new URLSearchParams(state.search);
      for (let z in options.params) params.set(z, options.params[z]);
      state.search = params.toString();
    }
    router.setState(state, options.event || null);
  },
  setState (newState, event){
    if (!newState.__state__) newState = router.generateState(newState);
    let routeMatched;
    let oldState = router.last;
    router.filters.forEach(filter => {
      let pathMatched = filter.path && !!filter.path.match(newState.path);
      let pathChanged = pathMatched && !filter.path.match(oldState.path);
      let paramsChanged = filter.params ? filter.params.some(param => {
        return oldState.params[param] !== newState.params[param];
      }) : false;
      if (pathMatched) {
        routeMatched = location.origin === newState.origin;
        if (routeMatched && (pathChanged || paramsChanged)) filter.listener(newState, oldState);
      }
    });
    if (routeMatched) {
      if (event && event.type !== 'popstate') event.preventDefault();
      if (router.initialized){
        if ((newState.href !== oldState.href) && event && event.type !== 'popstate') {
          history.pushState(newState, 'Identity' + (newState.title ? ' - ' + newState.title : ''), newState.search);
        }
      }
      else {
        history.replaceState(newState, 'Identity' + (newState.title ? ' - ' + newState.title : ''), newState.search);
      }
      document.documentElement.setAttribute('route', newState.path + newState.search);
      router.last = newState;
      dispatchEvent(new Event('routechange', {
        detail: {
          current: newState,
          previous: oldState
        }
      }));
    }
    router.initialized = true;
  }

}, window.router || {});

window.onpopstate = function(event){
  router.setState(event.state);
}

delegateEvent('click', 'a[href]', function(event, delegate){
  router.setState(delegate, event);
})

})()

nav_toggle.addEventListener('pointerup', e => {
  overlay_panels.open('nav');
});