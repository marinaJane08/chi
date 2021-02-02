import Taro from '@tarojs/taro';

const env = process.env.TARO_ENV;

export default {
  name: 'user',
  state: {
    userData: null,//用户数据 { data: { nickName.. }, _id: .. }
    logined: false,
  },
  reducer: (state, action) => {
    let { userData } = state;
    switch (action.type) {
      case 'initLoginData':
        // 从本地存储拉取用户信息
        if (!userData) {
          try {
            userData = Taro.getStorageSync('userData');
          } catch (error) { console.log(error) }
        }
        return {
          ...state,
          userData,
          logined: userData ? true : false
        }
      case 'setLoginData':
        userData = action.payload;
        try {
          Taro.setStorageSync('userData', userData);
        } catch (error) { console.log(error) }
        return {
          ...state,
          userData,
          logined: userData ? true : false
        }
      case 'clearLoginData':
        // 清空登陆数据
        userData = null;
        try {
          Taro.removeStorageSync('userData');
        } catch (error) { console.log(error) }
        return {
          ...state,
          userData,
          logined: false
        }
      default:
        return state;
    }
  }
}
