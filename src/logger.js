const isDev = process.env.NODE_ENV === 'development'
const signale = require('signale')

module.exports = {
  pending(...args) {
    isDev ? signale.pending(...args) : console.log(...args)
  },
  waiting(...args) {
    isDev ? signale.await(...args) : console.log(...args)
  },
  success(...args) {
    isDev ? signale.success(...args) : console.log(...args, '\n')
  },
  fail(...args) {
    isDev ? signale.fatal(...args) : console.error(...args, '\n')
  }
}
