// NOTE: PLEASE DON'T USE THIS UTIL FUNCTION FOR SUBSTRATE
let timeout

export const generalDebounce = (fn, delayTime, root = undefined) => {
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(root ? root : this, args), delayTime)
  }
}
