export function debounce (fn, time) {
  let timeout

  return function () {
    const functionCall = () => fn.apply(this, arguments)

    clearTimeout(timeout)
    timeout = setTimeout(functionCall, time)
  }
}

export function pick (obj, props) {
  return Object.entries(obj)
    .filter(([key]) => props.includes(key))
    .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {})
}

export function cloneDeep (obj) {
  return JSON.parse(JSON.stringify(obj))
}
/**
 * Simple is object check.
 * @param item
 * @returns {boolean}
 */
export function isObject (item) {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null)
}
