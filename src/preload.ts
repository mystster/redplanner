import Api from '@/Ipc';
// import { contextBridge } from 'electron';
console.log('preload');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// contextBridge.exposeInMainWorld('api', Api);

Object.assign(window, Api);
