import React, { memo, Fragment, useState, useEffect } from 'react';
import Taro, { useShareAppMessage, useReady, useRouter } from '@tarojs/taro';
import { View, ScrollView, Text, Button } from '@tarojs/components';

const log = console.log;

export default memo(({ tabList, defaultTab = 0, minTopPx = 0 }) => {
  const [curTab, setCurTab] = useState(defaultTab);
  const [curTabScroll, setCurTabScroll] = useState(`tab_0`);
  const [curContent, setCurContent] = useState(`content_0`);
  const [contentsTopMap, setContentsTopMap] = useState(0);
  const [useTap, setUseTap] = useState(false);
  // 内容滚动事件
  const onContentScroll = (e) => {
    if (useTap) {
      // 点击tab切换标签的滚动
      setUseTap(false);
      return;
    }
    let _scrollTop = e.detail.scrollTop,
      _curTabIndex, _curTabScrollIndex;
    if (_scrollTop < minTopPx) {
      // 滚动到顶部（左边tab也滚动到顶部）
      _curTabIndex = 0;
      _curTabScrollIndex = 0;
    } else {
      // 其它tab（滚动到上一个tab）
      _curTabIndex = Number(Object.keys(contentsTopMap).find(id => contentsTopMap[id] > e.detail.scrollTop));
      _curTabScrollIndex = _curTabIndex - 1;
    }
    if (_curTabIndex !== undefined) {
      // 设置当前高亮tab和滚动定位tab
      setCurTab(_curTabIndex);
      setCurTabScroll(`tab_${_curTabScrollIndex}`);
    }
  }
  // 点击tab
  const onTabClick = (index) => {
    // 设置点击标识
    setUseTap(true);
    // 设置当前高亮tab、滚动定位tab、滚动定位内容块
    setCurTab(index);
    setCurTabScroll(`tab_${index === 0 ? 0 : index - 1}`);
    setCurContent(`content_${index}`);
  }
  useReady(() => {
    // 生成所有内容块顶部距离数据
    const query = Taro.createSelectorQuery();
    let _topMap = {};
    let _sumTop = 0;
    query.selectAll('.Tabs-contents').boundingClientRect(rects => {
      rects.forEach((rect, index) => {
        // 叠加高度计算每个内容块的顶部距离
        _topMap[index] = _sumTop;
        _sumTop = _sumTop + rect.height;
      });
    }).exec();
    setContentsTopMap(_topMap);
  });
  return <View className="flex overflow-auto">
    <ScrollView
      className="whitespace-nowrap w-max"
      scrollY={true}
      // scrollWithAnimation={true}
      // scrollAnimationDuration={100}
      scrollIntoView={curTabScroll}
    >
      {
        tabList.map((tab, index) => {
          let id = `tab_${index}`;
          return <View
            id={id}
            className={`Tabs-tab ${curTab === index ? 'Tabs-tab-active' : ''}`}
            onClick={onTabClick.bind(null, index)}
          >{tab.title}</View>
        })
      }
    </ScrollView>
    <ScrollView
      scrollY={true}
      // scrollWithAnimation={true}
      // scrollAnimationDuration={100}
      onScroll={onContentScroll}
      scrollIntoView={curContent}
      className="Tabs-content"
    >
      {
        tabList.map((tab, index) => {
          let id = `content_${index}`;
          return <View
            key={index}
            id={id}
            className="Tabs-contents"
          >{tab.Content}</View>
        })
      }
    </ScrollView>
  </View>
})
