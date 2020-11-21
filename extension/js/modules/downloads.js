
let downloads = {};
let listeners = {
  fileReady: new Map(),
  completed: new Map()
};

let eventHandler = obj => {
  let dl = downloads[obj.id] = Object.assign(downloads[obj.id] || {}, obj);
  if (!dl._fileReady && obj.filename && obj.filename.current) {
    dl.title = dl.filename.current.replace(/\\+/g, '/').split(/\/+/).pop() || '';
    listeners.fileReady.forEach(fn => fn(dl));
    dl._fileReady = true;
  }
  if (dl.state && dl.state.current === 'complete') {
    listeners.completed.forEach(fn => fn(dl));
    delete downloads[obj.id];
  }
};

browser.downloads.onCreated.addListener(eventHandler);
browser.downloads.onChanged.addListener(eventHandler);

function generateListener(name){
  return {
    addListener(fn){
      listeners[name].set(fn, fn);
    },
    removeListener(fn){
      listeners[name].delete(fn);
    },
    hasListener(fn){
      listeners[name].has(fn);
    }
  }
}

export default {
  onCreated: browser.downloads.onCreated,
  onChanged: browser.downloads.onChanged,
  onErased: browser.downloads.onErased,
  onFileReady: generateListener('fileReady'),
  onCompleted: generateListener('completed')
}