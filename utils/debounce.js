const debounce = (fn, delay) => {
  let timer = null
  let newFn = function () {
    if (timer) {
      clearTimeout(timer)
    }
    const _this = this
    const _arguments = arguments
    console.log(_arguments)
    timer = setTimeout(() => {
      fn.apply(_this, _arguments)
    }, delay)
  }
  newFn.cancel = () => {
    timer && clearTimeout(timer)
  }
  return newFn
}

const fn = (a) => {
  console.log(a)
}

const _fn = debounce(fn, 500, 1)

_fn(600)
