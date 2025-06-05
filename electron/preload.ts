import { contextBridge, ipcRenderer } from 'electron'

interface IpcRendererApi {
  on(...args: Parameters<typeof ipcRenderer.on>): Electron.IpcRenderer;
  off(...args: Parameters<typeof ipcRenderer.off>): Electron.IpcRenderer;
  send(...args: Parameters<typeof ipcRenderer.send>): void;
  invoke(...args: Parameters<typeof ipcRenderer.invoke>): Promise<any>;
}

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))

contextBridge.exposeInMainWorld('electronAPI', {
  updateLoggingSettings: (enableLogging: boolean) => ipcRenderer.invoke('update-logging-settings', enableLogging),
  getLogFilePath: () => ipcRenderer.invoke('get-log-file-path'),
})

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj)

  for (const [key, value] of Object.entries(protos)) {
    if (value instanceof Function) {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args)
      }
    }
  }
  return obj
}
