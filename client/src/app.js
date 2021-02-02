import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import Provider, { useRedux } from '@/reducer';
import '@/styles/app.scss';
import '@/const';

const log = console.log;

// 做一些数据初始化
const Child = ({ children }) => {
  const user = useRedux('user');
  const app = useRedux('app');
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init();
    }
    // 本地初始化登陆、用户信息
    user.dispatch({ type: 'initLoginData' });
    try {
      // 初始化权限清单
      const authRes = await Taro.getSetting({ withSubscriptions: true });
      app.dispatch({ type: 'setAuthSetting', payload: authRes });
    } catch (error) {
    }
  }
  useEffect(() => {
    if (user.state.logined) {
      // 登陆状态下请求用户数据
      getUserInfo();
    }
  }, [user.state.logined]);
  const getUserInfo = async () => {
    try {
      let getRes = await Taro.cloud.callFunction({
        name: "user",
        data: {
          action: 'get',
          data: { _id: user.state.userData._id }
        }
      });
      if (getRes.result.code === 200) {
        // 更新用户信息
        user.dispatch({ type: 'setLoginData', payload: getRes.result.data });
      }
    } catch (error) {
    }
  }
  return children
}

export default class extends React.Component {
  componentDidShow(options) {
    log('app show', options, Taro.getCurrentPages())
    // 设置自定义tab的高亮tab
    // if (typeof this.getTabBar === 'function' &&
    //     this.getTabBar()) {
    //     this.getTabBar().setData({
    //       selected: 1
    //     })
    //   }
    // todo：转发场景进入时，且page不为首页时，提示左上角返回首页
  }
  componentCatchError() { }
  render() {
    return <Provider><Child>{this.props.children}</Child></Provider>
  }
}
