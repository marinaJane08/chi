// 把json参数序列化地址query
export function serializeQuery(obj) {
  let str = '?'
  Object.keys(obj).forEach(function (key) {
    str += key + "=" + obj[key] + '&'
  });
  let reg = /&$/gi;
  str = str.replace(reg, ""); //清除最后一个&符号
  return str
}
