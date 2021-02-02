const cloud = require('wx-server-sdk');
const { addRecord } = require('./utils.js');
const db = cloud.database();
const command = db.command;

const log = console.log;

// 获取用户数据
module.exports = async (data) => {
    let user = await addRecord({ table: db.collection('user'), data });
    return {
        data: user
    }
}
