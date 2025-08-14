const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('equilibre', {
  // expose config or native features if needed later
});
