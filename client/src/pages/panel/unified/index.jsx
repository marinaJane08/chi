import React, { Fragment, useState, useEffect, useRef } from 'react';
import Taro, { useShareAppMessage, useRouter, useDidShow } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { useRedux } from '@/reducer';
import Avatar from '@/components/Avatar';

const log = console.log;

export default (props) => {
  const user = useRedux('user');

  const watcher = useRef();
  // useEffect(() => {
  //   // 监听数据库实时变化
  //   const db = Taro.cloud.database();
  //   watcher.current = db.collection('todos')
  //     .where({
  //       team: 'our dev team'
  //     })
  //     .watch({
  //       onChange: function (snapshot) {
  //         console.log('docs\'s changed events', snapshot.docChanges)
  //         console.log('query result snapshot after the event', snapshot.docs)
  //         console.log('is init data', snapshot.type === 'init')
  //       },
  //       onError: function (err) {
  //         console.error('the watch closed because of error', err)
  //       }
  //     });
  //   return () => {
  //     // 关闭监听
  //     log('关闭watcher')
  //     watcher.current.close();
  //   }
  // }, []);

  return <View className="divide-x">
    <View className="bg-white">
      <Avatar />
      1
  </View>
    <View className="bg-white">
      <Avatar />
      2
  </View>
  </View>
}
