import { Cookie, ipcRenderer } from 'electron';

declare global {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Window {
    api: IpcApi;
  }
}
interface IpcApi {
  getMainProcessDir: () => Promise<string>;
  getCookies: (
    partition: string,
    url: string,
    name: string
  ) => Promise<Cookie[]>;
  setCookie: (
    partition: string,
    url: string,
    name: string,
    value: string
  ) => Promise<void>;
}

const Api: IpcApi = {
  getMainProcessDir: async () => await ipcRenderer.invoke('get-dir'),
  getCookies: async (partition: string, url: string, name: string) =>
    await ipcRenderer.invoke('get-cookies', partition, url, name),
  setCookie: async (
    partition: string,
    url: string,
    name: string,
    value: string
  ) => {
    await ipcRenderer.invoke('set-cookie', partition, url, name, value);
  }
};
export default Api;
