
(function(){
  
  var authTabs = window.authTabs = {};

  browser.tabs.onRemoved.addListener(id => {
    let tab = authTabs[id];
    if (tab) {
      delete authTabs[id];
      if (tab.type === 'opener') {
        browser.tabs.remove(tab.auth.id);
        delete authTabs[tab.auth.id];
      }
      delete authTabs[tab.opener.id];
    }
  });

  const badgeStates = {
    pending: ['#0000FF', '?'],
    confirmed: ['#228B22', '✓'],
    invalid: ['#FF0000', '!']
  };

  registerIntent({
    'browser.tabs.create': browser.tabs.create,
    'setActionState': (obj = {}) => {
      let state = badgeStates[obj.state || 'invalid'];
      browser.browserAction.setIcon({
        tabId: obj.tabId,
        path: `extension/images/favicon/user.png`
      });
      browser.browserAction.setBadgeBackgroundColor({
        tabId: obj.tabId,
        color: state[0]
      });
      browser.browserAction.setBadgeText({
        tabId: obj.tabId,
        text: state[1]
      });
    },
    'disableAction': (tabID) =>  {
      
    },
    'getCurrentTab': () => {
      return browser.tabs.query({ active: true }).then(tabs => tabs.pop())
    },
    'openAuthTab': () => {
      return browser.tabs.query({ active: true }).then(tabs => {
        let opener = tabs.pop();
        if (!opener) throw 'Refused to open auth tab for specified page';
        let existing = authTabs[opener.id];
        if (existing && existing.auth) return invokeIntent('focusTab', existing.auth.id);
        let entry = authTabs[opener.id] = { type: 'opener', opener: opener };
        return browser.tabs.create({
          index: opener.index + 1,
          url: browser.extension.getURL(`/extension/views/tabs/auth/index.html?opener=${opener.id}`)
        }).then(authTab => {
          entry.auth = authTab;
          authTabs[authTab.id] = { type: 'auth', opener: opener, auth: authTab };
          return authTab;
        })
      });
      
    },
    'focusTab': id => {
      return browser.tabs.update(id, { active: true, highlighted: true })
    }
  });

})();