const fs = require('fs')
const archiver = require('archiver')
const path = require('path')
const childProcess = require('child_process')
let isPack = false
// 创建zip包
const createZip = function () {
  return new Promise(function (resolve, reject) {
    // 导向到启动了静态服务器的目录，
    const output = fs.createWriteStream(path.join(__dirname, `../server/public/app.zip`))
    const archive = archiver('zip')
    archive.on('error', function (err) {
      console.log(err)
      resolve(false)
    })
    archive.on('end', function (err) {
      if (err) {
        console.log(err)
      }
      else {
        // console.log('完成')
      }
      resolve(true)
    })
    archive.pipe(output)
    archive.directory(path.join(__dirname, './test'), false)
    archive.finalize()
  })
}
const main = async function () {
  // 上传CDN & 更改数据库版本号 & 设置是否必须要更新
  if (isPack) {
    return
  }
  isPack = true
  const startTime = parseInt(new Date().getTime())
  console.log('打包中')
  await createZip()
  const overTime2 = parseInt(new Date().getTime())
  console.log(`打包耗时：${(overTime2 - startTime) / 1000} s`)
  console.log('完成')
  isPack = false
}
main()