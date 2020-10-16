

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
})