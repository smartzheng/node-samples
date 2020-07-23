/**
 * 手写Promise
 * @param executor
 * @constructor
 */
function Promise(executor) {
  this.status = 'pending'
  this.reason = null
  this.value = null
  this.onFullfilledArray = []
  this.onRejectedArray = []
  const resolve = (value) => {
    // 此处用setTimeout实际上无法实现微任务特性
    if (value instanceof Promise) {
      return value.then(resolve, reject)
    }
    setTimeout(() => {
      if (this.status === 'pending') {
        this.value = value
        this.status = 'fullfilled'
        this.onFullfilledArray.forEach(onfullfilled => {
          onfullfilled(value)
        })
      }
    })
  }
  const reject = (reason) => {
    setTimeout(() => {
      if (this.status === 'pending') {
        this.reason = reason
        this.status = 'rejected'
        this.onRejectedArray.forEach(onrejected => {
          onrejected(reason)
        })
      }
    })
  }

  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

Promise.prototype.then = function (onfullfilled, onrejected) {
  onfullfilled = typeof onfullfilled === 'function' ? onfullfilled : data => data
  onrejected = typeof onrejected === 'function' ? onrejected : error => {
    throw error
  }
  let promise2
  // 已经执行了this.onfullfilledFunc或者this.onrejectedFunc的情况下不会再执行onfullfilled和onrejected
  if (this.status === 'fullfilled') {
    return promise2 = new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          let result = onfullfilled(this.reason)
          resolvePromise(promise2, result, resolve, reject)
        })
      } catch (e) {
        reject(e)
      }
    })
  } else if (this.status === 'rejected') {
    return promise2 = new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          let result = onrejected(this.reason)
          resolvePromise(promise2, result, resolve, reject)
        })
      } catch (e) {
        reject(e)
      }
    })
  } else if (this.status === 'pending') {
    return promise2 = new Promise((resolve, reject) => {
      this.onFullfilledArray.push((value) => {
        try {
          let result = onfullfilled(value)
          resolvePromise(promise2, result, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
      this.onRejectedArray.push((reason) => {
        try {
          let result = onrejected(reason)
          resolvePromise(promise2, result, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })

  }

}
const resolvePromise = (promise2, result, resolve, reject) => {
  if (result === promise2) {
    reject(new TypeError('error due to circular reference'))
  }
  let consumed = false
  if (result instanceof Promise) {
    if (result.status === 'pending') {
      result.then(function (data) {
        resolvePromise(promise2, data, resolve, reject)
      }, reject)
    } else {
      result.then(resolve, reject)
    }
    return
  }
  let isComplexResult = target => (typeof target === 'function' || typeof target === 'object') && (target !== null)
  if (isComplexResult(result)) { // 疑似Promise
    try {
      let thenable = result.then
      if (typeof thenable === 'function') {
        thenable.call(result, function (data) {
          if (!consumed) {
            consumed = true
            return resolvePromise(promise2, data, resolve, reject)
          }
        }, function (error) {
          if (!consumed) {
            consumed = true
            return reject(error)
          }
        })
      } else {
        resolve(result)
      }
    } catch (e) {
      if (!consumed) {
        consumed = true
        return reject(e)
      }
    }
  } else {
    resolve(result)
  }
}

Promise.prototype.catch = function (catchFunc) {
  return this.then(null, catchFunc)
}

Promise.resolve = function (data) {
  return new Promise(resolve => {
    resolve(data)
  })
}

Promise.reject = function (data) {
  return new Promise((resolve, reject) => {
    reject(data)
  })
}

Promise.all = function (promiseArray) {
  if (!Array.isArray(promiseArray)) {
    throw new TypeError('The arguments should be an array!')
  }
  return new Promise((resolve, reject) => {
    try {
      let resultArray = []
      let count = 0
      for (let i = 0; i < promiseArray.length; i++) {
        const promise = promiseArray[i]
        promise.then(value => {
          resultArray[i] = value
          count++
          if (count === promiseArray.length) {
            resolve(resultArray)
          }
        }, reject)
      }
    } catch (e) {
      reject(e)
    }
  })
}

Promise.race = function (promiseArray) {
  if (!Array.isArray(promiseArray)) {
    throw new TypeError('The arguments should be an array!')
  }
  return new Promise((resolve, reject) => {
    try {
      const length = promiseArray.length
      for (let i = 0; i < length; i++) {
        promiseArray[i].then(resolve, reject)
      }
    } catch (e) {
      reject(e)
    }
  })
}
// test
// const b = true

// let promise = new Promise((resolve, reject) => {
//   if (b) {
//     setTimeout(() => {
//       resolve('resolve data')
//     }, 1000)
//   } else {
//     reject('reject result')
//   }
// })
// promise.then(value => {
//   console.log(`1. value: ${ value }`)
// }, reason => {
//   console.log(`reason: ${ reason }`)
// })
//
// promise.then(value => {
//   console.log(`2. value: ${ value }`)
// }, reason => {
//   console.log(`reason: ${ reason }`)
// })

// console.log('sync end')

new Promise(resolve => {
  resolve('data1')
}).then(value => {
  console.log(`value1: ${ value }`)
  return new Promise((resolve, reject) => {
    reject('data2')
  })
  // return 'data2'
}, reason => {
  console.log(`reason1: ${ reason }`)
}).then(value => {
  console.log(`value2: ${ value }`)
}, reason => {
  console.log(`reason2: ${ reason }`)
})
