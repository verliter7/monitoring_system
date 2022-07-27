export function randomString(len = 16) {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

export function hashCode(s: string) {
  let hash = 0,
    i,
    chr;

  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash = hash & hash;
  }

  return hash.toString();
}

export function pocessStackInfo(stackInfo: string) {
  const reg = /(\sat\s|\s)/g;

  return stackInfo
    .split('\n')
    .slice(1)
    .map((info) => info.replace(reg, ''))
    .join('-');
}

export function objecToQuery(o: Record<string, any>) {
  const result: string[] = [];

  for (const [k, v] of Object.entries(o)) {
    result.push(`${k}=${v}`);
  }
  return `?${result.join('&')}`;
}

export function getUrlHref(url: string | URL) {
  if (url instanceof URL) return url.origin + url.pathname;

  try {
    const newUrl = new URL(url);

    return newUrl.origin + newUrl.pathname;
  } catch (e) {
    if (url.indexOf('/') === -1) {
      url = '/' + url;
    }
    return (window.location.origin + url).split('?')[0];
  }
}
