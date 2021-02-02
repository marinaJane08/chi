const cloud = require('wx-server-sdk');
const { updateRecord } = require('./utils.js');
const db = cloud.database();
const command = db.command;

const log = console.log;

// 更新用户数据
module.exports = async ({ _id, ...data }) => {
    let user = await updateRecord({ table: db.collection('user'), _id, data });
    return {
        data: user
    }
}
