import React, { Fragment, useState, useEffect } from 'react';
import Taro, { useShareAppMessage, useRouter } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { useRedux } from '@/reducer';

const log = console.log;

export default (props) => {
  const user = useRedux('user');
  const app = useRedux('app');
  // 调用获取用户信息
  const getUserInfo = async () => {
    try {
      if (app.state.auth.authSetting["scope.userInfo"] === false) {
        // 已经拒绝授权的情况
        const authRes = await Taro.openSetting({ withSubscriptions: true });
        app.dispatch({ type: 'setAuthSetting', payload: authRes });
      }
      const userRes = await Taro.getUserInfo();
      return userRes.userInfo;
    } catch (error) {
      return null
    }
  }
  // 更新用户信息
  const onUpdateUserInfo = async () => {
    try {
      let userInfo = await getUserInfo();
      if (userInfo) {
        let updateRes = await Taro.cloud.callFunction({
          name: "user",
          data: {
            action: 'update',
            data: { _id: user.state.userData._id, userInfo }
          }
        });
        if (updateRes.result.code === 200) {
          user.dispatch({ type: 'setLoginData', payload: updateRes.result.data });
          Taro.showToast({ title: '更新成功', icon: 'success' });
          return true;
        } else {
          Taro.showToast({ title: updateRes.result.msg || '更新失败', icon: 'none' });
          return false;
        }
      }
      Taro.showToast({ title: '更新失败', icon: 'none' });
    } catch (error) {
      Taro.showToast({ title: '更新失败', icon: 'none' });
    }
  }
  // 登陆
  const onLogin = async () => {
    try {
      let userInfo = await getUserInfo();
      if (userInfo) {
        // 登陆接口
        let loginRes = await Taro.cloud.callFunction({
          name: "user",
          data: {
            action: 'login',
            data: userInfo
          }
        });
        if (loginRes.result.code === 200) {
          // 更新登陆数据
          user.dispatch({ type: 'setLoginData', payload: loginRes.result.data });
          Taro.showToast({ title: '登陆成功', icon: 'success' });
          return true;
        } else {
          Taro.showToast({ title: loginRes.result.msg || '登陆失败', icon: 'none' });
          return false;
        }
      }
      Taro.showToast({ title: '登陆失败', icon: 'none' });
    } catch (error) {
      Taro.showToast({ title: '登陆失败', icon: 'none' });
    }
  }
  // 登出
  const onLogout = () => {
    user.dispatch({ type: 'clearLoginData' });
  }
  return <View>
    {user.state.logined
      ? <Fragment>
        {user.state.userData && user.state.userData.userInfo ? <View>{user.state.userData.userInfo.nickName}</View> : '无用户信息'}
        <Button onClick={onUpdateUserInfo}>同步信息</Button>
        <Button onClick={onLogout}>登出</Button>
      </Fragment>
      : <Fragment>
        <Button openType="getUserInfo" onGetUserInfo={onLogin}>登陆</Button>
      </Fragment>
    }
  </View>
}
