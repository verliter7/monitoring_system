type Cb = (e: Event) => any;

class Eventemit {
  static instance: Eventemit;
  bus: HTMLElement;

  constructor() {
    this.bus = document.createElement('fakeelement');
  }

  static readonly getInstance = (): Eventemit => {
    if (!this.instance) {
      this.instance = new Eventemit();
    }
    return this.instance;
  };

  addEventListener(event: string, callback: Cb) {
    this.bus.addEventListener(event, callback);
  }

  removeEventListener(event: string, callback: Cb) {
    this.bus.removeEventListener(event, callback);
  }

  dispatchEvent(event: string, detail: Record<string, any> = {}) {
    this.bus.dispatchEvent(new CustomEvent(event, { detail }));
  }
}

// 单例模式导出
export default Eventemit.getInstance();
