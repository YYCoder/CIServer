/**
 * pm2 配置
 */
module.exports = {
  apps: [{
    // pm2应用名称
    "name": "CI-server",
    // 应用脚本
    "script": "src/index.js",
    // 应用参数
    "args": "--env=production",
    // "cwd": "/Users/yuanye/study/project/passwordManager",
    // 应用实例个数，集群模式有效
    // "instances": "max",
    // 内存超过多少重启
    "max_memory_restart": "100M",
    // 应用模式，fork或cluster
    "exec_mode": "fork",
    // watch模式，即应用代码发生变化会自动重启服务，类似于nodemon
    "watch": false,
    // 是否合并所有实例的log为一个
    "merge_logs": true,
    // 错误日志
    "error_file": `./log/CI-server.error.log`,
    // 输出日志
    "out_file": `./log/CI-server.access.log`,
    // 每条日志前缀添加的时间格式
    "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
    "kill_timeout": 5000
  }]
}