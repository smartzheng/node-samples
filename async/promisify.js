module.exports = function promisify(fn) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      args.push((err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
      fn.apply(null, args)
    })
  }
}
