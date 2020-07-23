import { ipcRenderer } from 'electron';

console.log('load!!!!!!');
window.onload = () => {
  console.log('inject script!!!!');
  document.body.onauxclick = (ev) => {
    console.dir(ev);
    // 中ボタンまたはCtrl+右ボタンが押されたとき
    if (ev.button === 1 || (ev.button === 2 && ev.ctrlKey === true)) {
      const element = ev.srcElement as HTMLElement;
      if (element.nodeName === 'A') {
        const a = element as HTMLAnchorElement;
        console.log(a.href);
        ev.preventDefault();
        ipcRenderer.sendToHost('open-newtab', a.href);
      }
    }
  };
};
