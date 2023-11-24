export const checkPhone = (phone: string) => {
  if (!phone) return false;
  const mobileReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
  const zuojiReg = /^(?:(?:\d{3}-)?\d{8}$|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/;

  return mobileReg.test(phone) || zuojiReg.test(phone);
};

/**
 * 补全图片路径
 * @param {string} img 图片路径
 * @returns
 */
export const completeImageUrl = (img: string) => {
  if (!img) return img;
  return img.startsWith('http') ? img : `${import.meta.env.VITE_APP_UPLOAD_URL}${img}`;
};
