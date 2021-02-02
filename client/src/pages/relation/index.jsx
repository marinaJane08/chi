import React, { Fragment, useState, useEffect } from 'react';
import Taro, { useShareAppMessage, useRouter } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { AtButton, AtBadge } from 'taro-ui';
import { useRedux } from '@/reducer';
import consts from '@/const';

const log = console.log;

export default (props) => {

  return <View className="">
    {
      consts.category.map(({ value, text }, index) => {
        return <AtBadge
          className="btn-space-lg"
          value={value > 99 ? value : 'NEW'}
          maxValue={99}>
          <AtButton size='small'>{text}</AtButton>
        </AtBadge>
      })
    }
  </View>
}
