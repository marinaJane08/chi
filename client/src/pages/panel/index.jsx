import React, { Fragment, useState, useEffect } from 'react';
import Taro, { useShareAppMessage, useRouter } from '@tarojs/taro';
import { View, Text, Input, Button, Form, Switch, Radio, RadioGroup } from '@tarojs/components';
import { AtForm, AtProgress, AtInput, AtButton, AtBadge } from 'taro-ui';
import { useRedux } from '@/reducer';
import Avatar from '@/components/Avatar';
import Tabs from '@/components/Tabs';
import TriggerModal from '@/components/TriggerModal';
import consts from '@/const';

const log = console.log;
// 初始化状态（没有小组）
const CreateGroup = ({
  initialValue = { name: '', category: {} },
  onOk = () => { }
}) => {
  const [value, setValue] = useState(initialValue);
  const [categories, setCategories] = useState(consts.category);
  const onSubmit = (e) => {
    onOk(value);
  }
  return <Form
    onSubmit={onSubmit}
  >
    <View>
      小组名
      <Input
        value={value.name}
        onInput={e => setValue({ ...value, name: e.detail.value })}
        type='text'
        placeholder='小组名'
      />
    </View>
    <TriggerModal
      title="选择类别"
      trigger={showModal => <AtButton
        type='primary'
        size='small'
        onClick={showModal}
      >{value.category.value ? value.category.text : '类别'}</AtButton>}
    >
      <RadioGroup>
        {categories.map((item, index) => {
          return <Radio
            value={item.value}
            label={item.text}
            checked={value.category.value === item.value}
            onClick={setValue.bind(null, { ...value, category: item })}
          >{item.text}</Radio>
        })}
      </RadioGroup>
    </TriggerModal>
    <View className="fixed inset-x-0 bottom-1">
      <Button
        formType='submit'
        disabled={!(value.name && value.category.value)}
      >创建小组</Button>
    </View>
  </Form>
}
export default (props) => {
  const [gruops, setGroups] = useState([]);
  const [tabList, setTabList] = useState([]);
  useEffect(() => {
    getGroups();
  }, []);
  const getGroups = async () => {
    const res = [
      {
        name: '爪子',
        members: [{ name: '我' }],
        status: 1,
        category: { name: '练习', id: 1 },
        updateTime: '2020 12-4 12:00',
        createTime: '2020 12-4 12:00'
      },
      {
        name: '爪子2',
        members: [{ name: '我', score: 10, expect_score: 15 }, { name: '嘟', score: 8, expect_score: 15 }],
        status: 2,
        category: { name: '学习', id: 1 },
        updateTime: '2020 12-4 12:00',
        createTime: '2020 12-4 12:00'
      }
    ];
    setGroups(res);
    let _tabList = [];
    res.forEach((item, index) => {
      _tabList.push({
        title: item.name,
        Content: <View className="panel-contents">
          {item.members.map(item => <Avatar />)}
          {item.status === 2
            ? <View>
              {item.members.map(item => <AtProgress percent={((item.score / item.expect_score) * 100).toFixed(2)} />)}
            </View>
            : <View>
              {item.name}
              <Text>{item.category.name}</Text>
              <Button>{item.status === 1 ? '去组队' : '去统一'}</Button>
            </View>
          }
        </View>
      });
    });
    setTabList(_tabList);
  }

  return <View className="h-full flex flex-col overflow-hidden">
    {gruops.length > 0
      ? <Tabs tabList={tabList} defaultTab={0} minTopPx={10}></Tabs>
      : <CreateGroup
        initialValue={{ name: '爪子', category: consts.category[0] }}
        onOk={() => Taro.navigateTo({ url: `/pages/panel/unified/index` })}
      />
    }
  </View>
}
