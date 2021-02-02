const consts = {
  category: [
    { text: "生活", value: '0' },
    { text: "练习", value: '1' },
    { text: "学习", value: '2' }
  ]
}
export default consts;

let maps = {},
  keyMaps = {};
for (let i in consts) {
  let obj = {},
    keyObj = {};
  consts[i].map(item => {
    obj[item.value] = item;
    // 用于命名值便于指代的情况
    keyObj[item.key] = item;
  });
  maps[i] = obj;
  keyMaps[i] = keyObj;
}
export const constMaps = maps;
export const constKeyMaps = keyMaps;
