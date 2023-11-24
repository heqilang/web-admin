const iframeId = '#iframe-map-blueearth';
import { nextTick } from 'vue';
function getIframe() {
  return new Promise(resolve => {
    nextTick(() => {
      const dom: any = document.querySelector(iframeId); // 根据id找到iframe
      if (!dom) {
        return console.log(new Error('未找到iframe'));
      }
      dom.onload = () => {
        resolve('iframe已准备好');
      };
    });
  });
}
function postMessage(data: { key: string; data?: any }) {
  nextTick(() => {
    const dom: any = document.querySelector(iframeId); // 根据id找到iframe
    if (dom) {
      dom?.contentWindow.postMessage(data, '*');
      console.log(data, '发送的数据');
    }
    !dom &&
      getIframe().then(() => {
        const dom: any = document.querySelector(iframeId); // 根据id找到iframe
        dom?.contentWindow.postMessage(data, '*');
        console.log(data, '发送的数据');
      });
  });
}
// 重置地图
function resetMap() {
  postMessage({ key: 'resetBuildingLocate' });
}
// 消火栓/微型消防站/消防站/智能充电/党群/楼栋
function devicePositioning(type: string, vis: boolean) {
  postMessage({
    key: 'showLabel',
    data: {
      type,
      vis
    }
  });
}
export { postMessage, resetMap, devicePositioning };
