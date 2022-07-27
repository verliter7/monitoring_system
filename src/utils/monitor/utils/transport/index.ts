import { objecToQuery } from '..';
import type {
  JsTransportError,
  PromiseTransportError,
  ResourceTransportError,
  HttpRequestTransportError,
} from '../../ErrorVitals/type';

type Transport = (
  serverUrl: string,
  errorInfo: JsTransportError | PromiseTransportError | ResourceTransportError | HttpRequestTransportError,
) => void;

// beacon 形式上报
export const beaconTransport: Transport = (serverUrl, errorInfo) => {
  const delay = 'requestIdleCallback' in window ? requestIdleCallback : setTimeout;

  delay(() => {
    const status = window.navigator.sendBeacon(serverUrl, JSON.stringify(errorInfo));

    // 数据量过大，则用 XMLHttpRequest 上报
    if (!status) xmlTransport(serverUrl, errorInfo);
  });
};

// XMLHttpRequest 形式上报
export const xmlTransport: Transport = (serverUrl, errorInfo) => {
  const delay = 'requestIdleCallback' in window ? requestIdleCallback : setTimeout;

  delay(() => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', serverUrl);
    xhr.send(JSON.stringify(errorInfo));
  });
};

//image 形式上报
export const imageTransport: Transport = (serverUrl, errorInfo) => {
  const delay = 'requestIdleCallback' in window ? requestIdleCallback : setTimeout;

  delay(() => {
    const image = new Image();

    image.src = serverUrl + encodeURI(objecToQuery(errorInfo));
  });
};
