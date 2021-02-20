import React, { Fragment, useState, useEffect } from 'react';
import Taro, { useShareAppMessage, useRouter } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { AtButton, AtBadge, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui';
import { useRedux } from '@/reducer';
import consts from '@/const';

const log = console.log;

export default (props) => {

  return <View className="">
    <AtModal isOpened>
      <AtModalHeader>╰(*°▽°*)╯</AtModalHeader>
      <AtModalContent>Hi！你看起来是第一次来呢，你想获得哪种快乐呢？</AtModalContent>
      <View><Button>🍉丰收</Button><Button className="nes-btn is-primary" hoverClass="nes-btn-active">🐷金币</Button></View>
      <Text>老用户跳过</Text>
    </AtModal>
  </View>
}
