function fun(args, callback) {
  try {
    console.log('fun execute: ', args)
    callback(null, 'data')
  } catch (e) {
    callback(e)
  }
}

fun(100, (err, res) => {
  console.log(res)
})

const promisify = require('./promisify')
const promisifyFun = promisify(fun)
promisifyFun(100).then(res=>{
  console.log(res)
}, err=>{
  console.log(err)
})
