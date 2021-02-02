import React, { Fragment, useState, useEffect } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';

export default ({ sizeClass }) => {
  return <Image
    className={`${sizeClass || 'square-1_2'} block rounded-full shadow-md max-w-full`}
    mode="aspectFill"
  ></Image>
}
