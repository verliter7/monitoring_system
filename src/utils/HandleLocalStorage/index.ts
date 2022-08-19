type GetParams = Array<string> | string;
type SetParams = Record<string, any>;
type RemoveParams = GetParams;

interface IHandleLocalStorage {
  get(params: Array<string>): Record<string, any>;
  get(params: string): any;
  readonly set: (params: SetParams) => void;
  readonly remove: (params: RemoveParams) => void;
}

/**
 * @description: 批量获取localStorage并转为对应的类型
 */
class HandleLocalStorage implements IHandleLocalStorage {
  private static instance: HandleLocalStorage;
  public static readonly getInstance = (): HandleLocalStorage => {
    if (!this.instance) {
      this.instance = new HandleLocalStorage();
    }
    return this.instance;
  };

  get(params: Array<string>): Record<string, any>;
  get(params: string): any;
  public get(params: GetParams) {
    if (Array.isArray(params)) {
      const localStorages: Record<string, any> = {};
      params.forEach((key) => {
        try {
          localStorages[key] = JSON.parse((localStorage.getItem(key) as string) || '{}');
        } catch (e) {
          localStorages[key] = localStorage.getItem(key);
        }
      });
      return localStorages;
    } else if (typeof params === 'string') {
      try {
        return JSON.parse((localStorage.getItem(params) as string) || '{}');
      } catch (e) {
        return localStorage.getItem(params);
      }
    }
  }

  public set(params: SetParams) {
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        localStorage.setItem(key, JSON.stringify((params as Record<string, any>)[key]));
      }
    }
  }

  public remove(params: RemoveParams) {
    if (Array.isArray(params)) {
      params.forEach((key) => {
        localStorage.removeItem(key);
      });
    } else if (typeof params === 'string') {
      localStorage.removeItem(params);
    }
  }
}

// 单例模式导出
export default HandleLocalStorage.getInstance();
