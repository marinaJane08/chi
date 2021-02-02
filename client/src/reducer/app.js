import Taro from '@tarojs/taro';

const env = process.env.TARO_ENV;

export default {
  name: 'app',
  state: {
    auth: null,//授权信息
  },
  reducer: (state, action) => {
    let { auth } = state;
    switch (action.type) {
      case 'setAuthSetting':
        // 更新授权信息
        auth = action.payload;
        return {
          ...state,
          auth
        }
      default:
        return state;
    }
  }
}
