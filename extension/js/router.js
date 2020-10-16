
(function() {

router = Object.assign({
  change: function(){},
  parse: function(){ return {} }
}, window.router || {});

var navFilter = function(event) {
  var match,
      target = event.target,
      root = event.currentTarget;
  while (!match && target && target != root) {
    if (target.tagName && target.matches('a[href]')) match = target;
    target = target.parentNode;
  }
  if (!match && root.tagName && root.matches('a[href]')) match = root;

  console.log(match, router.filter, match.href.match(router.filter));
  if (match && match.href.match(router.filter)) {
    event.preventDefault();
    routeUpdate(new URL(match.href).pathname, true);
  }
  event.preventDefault();
}

window.onpopstate = router.change;
if (router.filter) {
  document.addEventListener('click', navFilter);
  // document.addEventListener('pointerup', navFilter);
}

var state = { pathname: location.pathname };
var routeUpdate = window.routeUpdate = function routeUpdate(pathname) {
  if (!pathname) {
    throw new Error('Must pass a pathname as the first parameter to `routeUpdate`');
  }
  var path = pathname.replace(/.html$/, '');
  var segments = path.split('?')[0].match(/(\w+)/g) || [];
  var route = router.parse(segments);
  var title = 'DIF - ' + (route.title || 'Decentralized Identity Foundation')
  document.title = title;
  path = route.path || path;

  if (path !== location.pathname) {
    historyPush(title, path);
  }
  else {
    historyReplace(title, path);
  }
};

function historyPush(title, pathname) {
  window.scrollTo(0, 0);  // Ignore `history.scrollRestoration`
  state = {pathname: pathname};
  history.pushState(state, null, pathname);
  router.change();
}

function historyReplace(title, pathname) {
  state = {pathname: pathname};
  history.replaceState(state, null, pathname);
}

})();