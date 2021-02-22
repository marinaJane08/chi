import React, { Fragment, useState, useEffect } from 'react';
import Taro, { useShareAppMessage, useRouter } from '@tarojs/taro';
import { View, Text, Button, Form } from '@tarojs/components';
import { AtButton, AtInput, AtFab, AtIcon, AtBadge, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui';
import { useRedux } from '@/reducer';
import { useForm, useField, FormField } from '@/components/FormWidget';
import consts from '@/const';

const log = console.log;

const TaskList = ({ list = [], setShowTaskRecord = () => { } }) => {
  const [showTask, setShowTask] = useState(false);
  const hideTaskModal = () => {
    setShowTask(false);
  }
  const taskForm = useForm({
    onSubmit: async (formData, valid) => {
      // 更新任务
      if (!valid) return;
      await timeout(2000); // 模拟网络延迟
      if (formData.username.length < 10) {
        //模拟服务端返回 400
        usernameField.setErrors(["Make a longer username"]);
      } else {
        //模拟服务端返回 201
        window.alert(
          `taskForm valid: ${valid}, taskForm data: ${JSON.stringify(formData)}`
        );
        hideTaskModal();
      }
    }
  });
  const tasknameField = useField("task_name", taskForm, {
    defaultValue: showTask.task_name,
    validations: [
      async formData => {
        await timeout(2000);
        return formData.task_name.length < 6 && "Username already exists";
      }
    ],
    fieldsToValidateOnChange: []
  });
  let requiredFields = [tasknameField];
  return <View className="TaskList">
    {
      list.map((item, index) => {
        // 长按显示任务弹窗
        return <View
          key={index}
          onClick={setShowTaskRecord.bind(null, item)}
          onLongPress={setShowTask.bind(null, item)}
        >{item.task_name}</View>
      })
    }
    <AtButton onClick={setShowTask.bind(null, {})}>+</AtButton>
    {/* 任务表单 */}
    <AtModal isOpened={showTask}>
      <Form onSubmit={e => taskForm.onSubmit(e.detail)}>
        <AtModalHeader>任务</AtModalHeader>
        <AtModalContent>
          <FormField
            {...tasknameField}
            Widget={AtInput}
            formSubmitted={taskForm.submitted}
            title="任务名"
            type='text'
          />
          <AtInput
            name='respect_gold'
            title='预期得'
            type='text'
            value={showTask.respect_gold}
          >金币/金豆</AtInput>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={hideTaskModal}>取消</Button>
          <Button
            formType='submit'
            disabled={
              !taskForm.isValid() ||
              taskForm.submitting ||
              requiredFields.some(f => f.pristine)
            }
            loading={taskForm.submitting}
          >提交</Button>
        </AtModalAction>
      </Form>
    </AtModal>
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
    <TaskList list={[{ task_name: '健康餐' }]} setShowTaskRecord={setShowTaskRecord} />
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
