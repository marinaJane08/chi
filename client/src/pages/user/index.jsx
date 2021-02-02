import React, { Fragment, useState, useEffect, useRef } from 'react';
import Taro, { useShareAppMessage, useRouter, useDidShow } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { useRedux } from '@/reducer';

const log = console.log;
const tmplId = 'ZPpWc88CjMNugMyg-Oh2bJQ0o7fd8TkcxIT1PfbwFSk';

export default (props) => {
  const user = useRedux('user');
  const app = useRedux('app');
  if (process.env.TARO_ENV === 'weapp') {
    useShareAppMessage(res => {
      return {
        title: '嘟噜积分-记录你的生活',
        path: `/pages/user/index?_open=${user.state.userData.OPENID}`
      }
    });
  }
  useEffect(() => {
    let params = Taro.getCurrentInstance().router.params;
    // sendMsg(params);
  }, []);
  const sendMsg = async (params) => {
    try {
      // 有分享人信息时
      if (params._open) {
        // 发送成员加入通知
        let sendRes = await Taro.cloud.callFunction({
          name: "user",
          data: {
            action: 'send',
            data: {
              ...user.state.userData,
              sendId: params._open,
              tmplId
            }
          }
        });
        if (sendRes.result.code === 200) {
          Taro.showToast({ title: '通知成功', icon: 'success' });
          return true;
        } else {
          Taro.showToast({ title: sendRes.result.msg || '通知失败', icon: 'none' });
          return false;
        }
      }
    } catch (error) {
      Taro.showToast({ title: '通知失败', icon: 'none' });
    }
  }
  // 生成小组
  const onGenGroup = async () => {
    try {
      // 请求订阅消息
      const requestRes = await Taro.requestSubscribeMessage({ tmplIds: [tmplId] });
      // 更新授权信息
      const authRes = await Taro.getSetting({ withSubscriptions: true });
      app.dispatch({ type: 'setAuthSetting', payload: authRes });
      if (requestRes[tmplId] === 'accept') {
        Taro.showToast({ title: '授权成功', icon: 'success' });
        return true
      }
      Taro.showToast({ title: '授权失败', icon: 'none' });
    } catch (error) {
      Taro.showToast({ title: '授权失败', icon: 'none' });
    }
  }
  const dark = true;
  return <View>
    {/* 主面板 */}
    <View>
      <View className="bg-white">
        1
      </View>
      <View className="bg-white">
        2
      </View>
    </View>
    {/* 生成小组接受订阅消息 */}
    <Button onClick={onGenGroup}>生成</Button>
  </View>
}
