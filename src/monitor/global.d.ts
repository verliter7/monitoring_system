declare interface XMLHttpRequest {
  ajaxData: {
    method: string;
    url: string | URL;
  };

  oldOpen(method: string, url: string | URL): void;
  oldOpen(method: string, url: string | URL, async: boolean, username?: string | null, password?: string | null): void;

  oldSend(body?: Document | XMLHttpRequestBodyInit | null): void;
}
