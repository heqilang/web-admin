class GenerateUtil {
  /** 获取除路径参数外的请求路径 */
  static getPath(str) {
    const reg = /^(?:.(?!\{))*/;
    const result = reg.exec(str);
    return result[0];
  }

  /** 获取第一个/与第二个/间的字符串 */
  static getFirstName(str) {
    const reg = /^\/?(.*?)(?=\/).*/;
    const result = reg.exec(str);
    return result[1];
  }

  /** 获取最后一个/后的字符串 */
  static getLastName(str) {
    if (str.endsWith('/')) {
      str = str.slice(0, str.length - 1);
    }
    if (!str) return;
    const reg = /(?<=\/)(?:.(?!\/))*$/;
    const result = reg.exec(str);
    return result[0];
  }

  /** 最长公共前缀 */
  static longestCommonPrefix(strs) {
    let str = strs[0];
    while (!strs.every((item) => item.startsWith(str)) || !str.endsWith('/')) {
      str = str.slice(0, str.length - 1);
    }
    return str === '' ? '' : str;
  }

  /** 获取最长公共前缀中最后一个/后的字符串 */
  static filterName(strs) {
    let str = this.longestCommonPrefix(strs);
    const reg = /(.*?)(?<=\/)(?:.(?!\/))*$/;
    let res = reg.exec(str || '')[1] || '';
    if (res.endsWith('/')) {
      res = res.slice(0, res.length - 1);
    }
    return res;
  }
}
module.exports = GenerateUtil
