let ejs = require('ejs')
const fs = require('fs')
ejs.renderFile('./index.ejs', {title: '标题', content: '内容', user: {name: 'smartzheng'}}, {}, function(err, str){
  // str => 输出渲染后的 HTML 字符串
  console.log(str)
  fs.writeFileSync('./index.html', str)
});
