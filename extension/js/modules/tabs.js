
export default {
  raiseTab(url){
    browser.tabs.query({
      url: [url, url + '?*'],
      currentWindow: true
    }).then(tabs => {
      if (!tabs.length) browser.tabs.create({ url: url });
      else browser.tabs.update(tabs[0].id, { active: true });
    })
  }
}