import React, { Fragment, useState, useEffect } from 'react';
import { Button } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtForm, AtInput, AtButton, AtBadge } from 'taro-ui';

// 点击弹窗
export default ({
  title,
  trigger,
  onSubmit = async () => true,
  submitSuccess = () => { },
  footer,
  children,
  ...props
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const onOk = async () => {
    setLoading(true);
    let res = await onSubmit();
    if (res) {
      setLoading(false);
      setVisible(false);
      submitSuccess(res);
    } else {
      setLoading(false);
    }
  };
  const Trigger = trigger(e => {
    setVisible(true);
  });
  return <Fragment>
    {Trigger}
    <AtModal
      isOpened={visible}
      onClose={setVisible.bind(null, false)}
      {...props}
    >
      <AtModalHeader>{title}</AtModalHeader>
      <AtModalContent>{children}</AtModalContent>
      {footer !== false
        ? <AtModalAction>
          <Button onClick={setVisible.bind(null, false)}>取消</Button>
          <Button loading={loading} onClick={onOk}>确定</Button>
        </AtModalAction>
        : null
      }
    </AtModal>
  </Fragment>
}
