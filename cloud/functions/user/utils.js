const log = console.log;

// 新增记录
exports.addRecord = async ({ table, data }) => {
    try {
        let record = table.add({ data });
        return record;
    } catch (error) {
        log(error)
        return false
    }
}

// 更新记录（返回更新后的数据）
exports.updateRecord = async ({ table, _id, data }) => {
    try {
        await table.doc(_id).update({ data });
        return await this.getRecord({ table, _id });
    } catch (error) {
        log(error)
        return false
    }
}

// 查询记录（批量）
exports.getRecords = async ({ table, where }) => {
    try {
        let record = await table.where(where).get();
        return record;
    } catch (error) {
        log(error)
        return false
    }
}

// 查询记录（单个）
exports.getRecord = async ({ table, _id }) => {
    try {
        let record = await table.doc(_id).get();
        return record.data;
    } catch (error) {
        log(error)
        return false
    }
}