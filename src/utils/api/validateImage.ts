// 验证图片链接是否有效 HEAD请求方式
export default function validateImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url);
    // 在利用send发起AJax请求
    xhr.send();
    // 在利用onreadystatechange函数来进行监听
    xhr.onreadystatechange = function () {
      // 图片存在
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve();
      } else if (xhr.readyState === 4 && xhr.status === 404) {
        // 图片不存在
        console.warn(decodeURI(url), '图片不存在');
        reject();
      }
    };
  });
}
