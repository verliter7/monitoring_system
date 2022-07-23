/**
 * @description: 判断数据类型
 */
class JType {
  private static readonly getType = Object.prototype.toString;
  private static instance: JType;

  public static getInstance = (): JType => {
    if (!this.instance) {
      this.instance = new JType();
    }
    return this.instance;
  };
  public isUndefined = (value: unknown): value is undefined => JType.getType.call(value) === '[object Undefined]';
  public isNull = (value: unknown): value is null => JType.getType.call(value) === '[object Null]';
  public isString = (value: unknown): value is string => JType.getType.call(value) === '[object String]';
  public isNumber = (value: unknown): value is number => JType.getType.call(value) === '[object Number]';
  public isBoolean = (value: unknown): value is boolean => JType.getType.call(value) === '[object Boolean]';
  public isSymbol = (value: unknown): value is Symbol => JType.getType.call(value) === '[object Symbol]';
  public isArray = (value: unknown): value is any[] => JType.getType.call(value) === '[object Array]';
  public isObject = (value: unknown): value is Record<any, any> => JType.getType.call(value) === '[object Object]';
  public isFunction = (value: unknown): value is Function => JType.getType.call(value) === '[object Function]';
}

// 单例模式导出
export default JType.getInstance();
