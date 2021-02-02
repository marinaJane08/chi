
const cloud = require('wx-server-sdk');
const { getRecords, getRecord, addRecord } = require('./utils.js');
const db = cloud.database();
const command = db.command;

const log = console.log;

// 登陆
module.exports = async (data) => {
    // 上下文OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
    const wxContext = cloud.getWXContext();
    let result = { code: 200, data: {} };
    const userTable = db.collection('user');
    // 查询用户
    let getUser = await getRecords({
        table: userTable,
        where: {
            OPENID: command.eq(wxContext.OPENID)
        }
    });
    getUser = getUser && getUser.data[0] ? getUser.data[0] : false;
    if (getUser) {
        // 用户已注册
        result.data = getUser;
    } else {
        // 未注册
        if (data) {
            // 有用户授权信息时新增用户
            let addUser = await addRecord({
                table: userTable,
                data: { userInfo: data, OPENID: wxContext.OPENID }
            });
            if (addUser) {
                // 返回数据
                result.data = { userInfo: data, OPENID: wxContext.OPENID };
            }
        } else {
            result = { code: 500, msg: '请授权后登陆' }
        }
    }
    return result
}