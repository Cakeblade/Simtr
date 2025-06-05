/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_DEV_SERVER_URL?: string
    VITE_PUBLIC: string
  }
}

interface IpcRendererApi {
  on(
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ): Electron.IpcRenderer;
  off(
    channel: string,
    listener?: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ): Electron.IpcRenderer;
  send(channel: string, ...args: any[]): void;
  invoke(channel: string, ...args: any[]): Promise<any>;
}

declare global {
  interface Window {
    readonly ipcRenderer: IpcRendererApi;
  }
}
