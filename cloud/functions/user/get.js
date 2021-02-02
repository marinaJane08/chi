const cloud = require('wx-server-sdk');
const { getRecord } = require('./utils.js');
const db = cloud.database();
const command = db.command;

const log = console.log;

// 获取用户数据
module.exports = async (data) => {
    let user = await getRecord({ table: db.collection('user'), _id: data._id });
    return {
        data: user
    }
}
