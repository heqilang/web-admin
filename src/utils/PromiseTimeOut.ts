export function PromiseTimeout<T>(promise: Promise<T>, timeoutMillis = 20000): Promise<any> {
  let timer: number;
  return Promise.race([
    promise,
    new Promise(function (_resolve, reject) {
      timer = setTimeout(function () {
        reject(new Error('Failed to fetch'));
      }, timeoutMillis);
    })
  ]).then(
    function (v) {
      clearTimeout(timer);
      return v;
    },
    function (err) {
      clearTimeout(timer);
      throw err;
    }
  );
}
