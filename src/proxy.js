/**
 * 请求Travis CI模块
 * @param  {String} repo [要构建的仓储名称]
 * @return {Promise}
 */
const { execSync, exec } = require('child_process')
const fs = require('fs')
const { resolve } = require('path')
const https = require('https')
// 引入logger模块
const { success, pending, fail, waiting } = require('./logger')

module.exports = async function (repo) {
  // personal github access token
  const GithubAccessToken = fs.readFileSync(resolve(__dirname, '../.github-token'), 'utf8')
  const hasLogin = await new Promise((resolve) => {
    exec('travis whoami', (err, res) => {
      if (err) {
        waiting('Travis CI has not logged in, logining in...')
        return resolve(false)
      }
      resolve(true)
    })
  })
  // 若 travis 未登录，则先登录
  if (!hasLogin) {
    execSync(`travis login -g ${GithubAccessToken} --org`)
  }
  waiting('getting Travis CI Token')
  // Travis API Token
  const TravisAccessToken = execSync('travis token --org').toString('utf8').replace(/\r?\n|\r/g, '')
  // 要发送到Travis CI的数据
  const data = `{
    "request": {
      "branch": "master"
    }
  }`
  // 请求Travis CI配置对象
  const opts = {
    host: 'api.travis-ci.org',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json',
      'travis-api-version': '3',
      'authorization': `token ${TravisAccessToken}`
    },
    path: `/repo/YYCoder%2F${repo}/requests`
  }
  const successCb = function (res, resolve) {
    const { statusCode: code, statusMessage: message } = res
    let body = ''
    pending(`status code: ${code}, status message: ${message}`)
    res.setEncoding('utf8')
    res.on('data', (chunk) => body += chunk)
    res.on('end', () => resolve({ code, body }))
  }
  const errorCb = function (err, resolve) {
    resolve(err)
  }

  return new Promise((resolve) => {
    const request = https.request(opts, (res) => successCb(res, resolve))
    request.on('error', (err, reject) => errorCb(err, resolve))
    // 写入数据到请求主体，发起请求
    request.write(data)
    request.end()
  })
}