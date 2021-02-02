const cloud = require('wx-server-sdk');
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
});
const get = require('./get.js');
const add = require('./add.js');
const login = require('./login.js');
const update = require('./update.js');
const send = require('./send.js');

const log = console.log;

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * event 参数包含小程序端调用传入的 data
 */
const handler = { get, add, login, update, send };
exports.main = async (event, context) => {
  const { action, data } = event;
  if (handler[action]) {
    let res = await handler[action](data, context);
    return { code: 200, ...res };
  } else {
    return { code: 400, msg: '找不到对应函数' }
  }
}

