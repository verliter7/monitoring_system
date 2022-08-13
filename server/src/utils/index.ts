export function uniq(array: any[], comparator: (...args: [any, any]) => boolean) {
  let result = [];
  comparator = comparator ?? Object.is;

  outer: for (let i = 0; i < array.length; i++) {
    let value = array[i];

    for (let j = 0; j < result.length; j++) {
      if (comparator(value, result[j])) {
        continue outer;
      }
    }

    result.push(value);
  }

  return result;
}

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
