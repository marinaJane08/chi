import React, { Fragment, useState, useEffect } from 'react';
import Taro, { useShareAppMessage, useRouter } from '@tarojs/taro';
import { View, Form, Text, Input, Button } from '@tarojs/components';
import { AtButton, AtInput, AtFab, AtIcon, AtBadge, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui';
import { useForm, useField, Field } from '@/components/HookForm';
import { useRedux } from '@/reducer';
import consts from '@/const';

const log = console.log;

const TaskForm = ({ defaultValues, hide }) => {
  // 使用useForm hooks创建实例
  const form = useForm({
    // 传入onSubmit接收校验结果和表单数据
    onSubmit: async (formData, valid) => {
      if (!valid) return;
      if (formData.task_name.length < 10) {
        //模拟服务端返回 400
        usernameField.setErrors(["Make a longer task_name"]);
      } else {
        //模拟服务端返回 201
        console.log(
          `form valid: ${valid}, form data: ${JSON.stringify(formData)}`
        );
        hide();
      }
    }
  });

  // useField接收字段name和form实例，传入初始值和rules，以及当值发生改变时需要校验的其他字段
  const usernameField = useField("task_name", form, {
    defaultValue: defaultValues.task_name,
    validations: [
      async formData => {
        return formData.task_name.length < 6 && "Username already exists";
      }
    ],
    fieldsToValidateOnChange: []
  });
  return <AtModal isOpened={true}>
    <Form onSubmit={form.onSubmit}>
      <AtModalHeader>任务</AtModalHeader>
      <AtModalContent>
        <Field field={usernameField} form={form}>
          <AtInput
            title="任务名"
            type='text'
          />
        </Field>
        {/* <HeroForm.Item name='respect_gold'>
            <AtInput
              title='预期得'
              type='text'
            >金币/金豆</AtInput>
          </HeroForm.Item> */}
      </AtModalContent>
      <AtModalAction>
        <AtButton onClick={hide}>取消</AtButton>
        <Button formType='submit'>提交</Button>
      </AtModalAction>
    </Form>
  </AtModal>
}

const TaskList = ({ list = [], setShowTaskRecord = () => { } }) => {
  const [showTask, setShowTask] = useState(false);
  const [taskValues, setTaskValues] = useState({});
  const hideTaskModal = () => {
    setTaskValues({});
    setShowTask(false);
  }
  const showTaskModal = (data) => {
    setTaskValues(data);
    setShowTask(true);
  }
  return <View className="TaskList">
    {
      list.map((item, index) => {
        // 长按显示任务弹窗
        return <View
          key={index}
          onClick={showTaskModal.bind(null, item)}
        // onLongPress={showTaskModal.bind(null, item)}
        >{item.task_name}</View>
      })
    }
    <AtButton onClick={setShowTask.bind(null, {})}>+</AtButton>
    {/* 任务表单 */}
    {showTask && <TaskForm defaultValues={taskValues} hide={hideTaskModal} />}
  </View>
}

export default (props) => {
  const [showTaskRecord, setShowTaskRecord] = useState(false);
  const hideTaskRecordModal = () => {
    setShowTaskRecord(false);
  }
  // 新增任务记录
  const onTaskRecordSubmit = (e) => {
    log('onTaskRecordSubmit', e.detail)
    hideTaskRecordModal();
  }
  return <View className="">
    <TaskList list={[{ task_name: '健康餐', respect_gold: '2' }]} setShowTaskRecord={setShowTaskRecord} />
    {/* <AtModal isOpened>
      <AtModalHeader>╰(*°▽°*)╯</AtModalHeader>
      <AtModalContent>Hi！你看起来是第一次来呢，你想获得哪种快乐呢？</AtModalContent>
      <View><AtButton>🍉丰收</AtButton><AtButton>🐷金币</AtButton></View>
      <Text>老用户跳过</Text>
    </AtModal> */}
    {/* 任务完成记录 */}
    <AtModal isOpened={showTaskRecord}>
      <Form onSubmit={onTaskRecordSubmit}>
        <AtModalHeader>任务记录</AtModalHeader>
        <AtModalContent>
          {showTaskRecord.task_name}
        </AtModalContent>
        <AtModalAction>
          <Button onClick={hideTaskRecordModal}>取消</Button>
          <Button formType='submit'>提交</Button>
        </AtModalAction>
      </Form>
    </AtModal>
  </View>
}
