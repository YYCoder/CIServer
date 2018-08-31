// 设置环境变量
process.env.NODE_ENV = process.argv[2] === '--dev' ? 'development' : 'production'
const signale = require('signale')

const config = {
  development: {
    port: 3000
  },
  production: {
    port: 3002
  }
}

// 开发模式日志输出配置
signale.config({
  displayFilename: true,
  displayTimestamp: true,
  displayDate: false
})
module.exports = config[process.env.NODE_ENV]
