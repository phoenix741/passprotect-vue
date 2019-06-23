import lodashMerge from 'lodash.merge';

export function debounce<F extends (...params: any[]) => void>(fn: F, time: number) {
  let timeout: NodeJS.Timeout;

  return function(this: any, ...args: any[]) {
    const functionCall = () => fn.apply(this, args);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  } as F;
}

export function pick<T, K extends keyof T>(obj: T, props: Array<K>): Pick<T, K> {
  return Object.entries(obj)
    .filter(([key]) => props.includes(key as K))
    .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {}) as Pick<T, K>;
}

export function omit<T, K extends keyof T>(obj: T, props: Array<K>): Omit<T, K> {
  return Object.entries(obj)
    .filter(([key]) => !props.includes(key as K))
    .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {}) as Omit<T, K>;
}

export function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Simple is object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item) && item !== null;
}

export function merge(into: any, ...from: Array<any>) {
  return lodashMerge({}, into, ...from);
}
