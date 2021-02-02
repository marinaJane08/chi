const cloud = require('wx-server-sdk');
const { getRecord } = require('./utils.js');
const db = cloud.database();
const command = db.command;

const log = console.log;

// 发送订阅消息
module.exports = async (data) => {
    log('发送订阅消息【参数】', data)
    try {
        const sendRes = await cloud.openapi.subscribeMessage.send({
            touser: data.sendId,
            templateId: data.tmplId,
            // 接收者点击消息时跳转的页面
            page: 'pages/index/index',
            data: {
                thing1: {
                    value: '小花'
                },
                thing2: {
                    value: '嘟噜🏠'
                },
                thing3: {
                    value: '可以开启积分之旅啦～'
                }
            },
            miniprogramState: 'developer'
        });
        log('发送订阅消息【成功】', sendRes)
    } catch (error) {
        log('发送订阅消息【失败】', error)
    }
    return {
        data: {}
    }
}
