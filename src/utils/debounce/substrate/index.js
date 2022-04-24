// TODO: Need additional configuration if needed
let timeout

export const substrateDebounce = (fn, delayTime, root = undefined) => {
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(root ? root : this, args), delayTime)
  }
}
