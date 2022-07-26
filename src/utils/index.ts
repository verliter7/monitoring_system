export { default as HttpReq } from './HttpReq';
export { default as JType } from './JType';
export { default as HandleLocalStorage } from './HandleLocalStorage';
export { default as commonStyles } from './commonStyles';

// 工具方法

/**
 * @description: 枚举 {a: 1, b: 2} <=> {a: 1, b: 2, 1: 'a', 2: 'b'}
 * @param obj 要枚举的对象或者数组
 * @return
 */
export function enumUtils(obj: Array<any> | Record<any, any>): Record<any, any> {
  const enumObj: Record<any, any> = {};
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      enumObj[(enumObj[item] = index)] = item;
    });
  } else {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        enumObj[(enumObj[obj[key]] = key)] = obj[key];
      }
    }
  }

  return enumObj;
}

/**
 * @description: 函数组合：目的是将多个函数组合成一个函数（函数式编程），传入的函数会像一条流水线一样从右到左执行，把初始化实参一层层加工传下去，最终返回我们需要的值
 * @param 要传入的函数(xxx, xx, x)
 * @return 最终的函数，传入初始化实参即可
 */
type Noop<A, B> = (a: A) => B;
export function compose<
  Fn1 extends Noop<any, any>,
  Fns extends Noop<any, any>[],
  R extends Fns extends []
    ? Fn1
    : Fns extends [Noop<infer A, any>]
    ? (a: A) => ReturnType<Fn1>
    : Fns extends [any, Noop<infer A, any>]
    ? (a: A) => ReturnType<Fn1>
    : Fns extends [any, any, Noop<infer A, any>]
    ? (a: A) => ReturnType<Fn1>
    : Fns extends [any, any, any, Noop<infer A, any>]
    ? (a: A) => ReturnType<Fn1>
    : Fns extends [any, any, any, any, Noop<infer A, any>]
    ? (a: A) => ReturnType<Fn1>
    : Fns extends [any, any, any, any, any, Noop<infer A, any>]
    ? (a: A) => ReturnType<Fn1>
    : Noop<any, ReturnType<Fn1>>,
>(noop: Fn1, ...restFns: Fns): R {
  const fns = [noop, ...restFns];
  return function (value: any) {
    return fns.reduceRight((pre, cur) => cur(pre), value);
  } as R;
}
