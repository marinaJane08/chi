import React, { Fragment, useState, useEffect } from 'react';
import Taro, { useShareAppMessage, useRouter } from '@tarojs/taro';
import { View, Input, Button, Form, Switch } from '@tarojs/components';
import { useRedux } from '@/reducer';
import Avatar from '@/components/Avatar';

const log = console.log;

export default (props) => {
  const user = useRedux('user');

  return <View className="h-full flex flex-col overflow-hidden">
    <Avatar sizeClass="square-1_4" />
  </View>
}
