export { default as HttpReq } from './HttpReq';
export { default as commonStyles } from './commonStyles';
export { default as api } from './urls';

/**
 * @description: 获取随机字符串
 */
export function getRandomStr(len = 16) {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
