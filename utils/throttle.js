function throttle(fn, delay, trailing) {
  let last = 0
  let timer = null
  return function () {
    const _this = this
    const _arguments = arguments
    const now = new Date().getTime()
    if (now - last > delay) {
      fn.apply(_this, _arguments)
      last = now
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    } else if (timer === null && trailing) {
      timer = setTimeout(() => {
        timer = null
        fn.apply(_this, _arguments)
      })
    }
  }
}
