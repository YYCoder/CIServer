// 引入配置
const { port } = require('../config')
const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const body = require('koa-body')()
// 引入logger模块
const { success, pending, fail, waiting } = require('./logger')
// 引入proxy模块
const proxy = require('./proxy')

router
  .get('/', async (ctx, next) => {
    pending('CI Server has received a get request')
    ctx.body = 'request success !'
    success('response success !')
  })
  .post('/', async (ctx, next) => {
    const params = ctx.request.body || {}
    const payload = params.payload ? JSON.parse(params.payload) : {}
    let responseText = ''
    // 获取仓储名称
    const { name: repository } = payload.repository || {}
    // 调试输出
    pending('CI Server has received a post request')
    pending('request params: ', payload)
    // 请求Travis CI API
    const res = await proxy(repository)

    if (!/^2\d+/.test(res.code)) {
      fail(`request to Travis CI has returned an error, err: ${JSON.stringify(res, '', 2)}`)
      responseText = 'request failed !'
    }
    else {
      success('response success !')
      responseText = 'request succeed !'
    }
    ctx.body = responseText
  })


app
  .use(body)
  .use(router.routes())

app.listen(port)