import React, { Fragment, cloneElement, useRef, useState, useEffect } from 'react';
import { View, Form, Text, Input, Button } from '@tarojs/components';

export const useField = (
  name,
  form,
  { defaultValue, validations = [], fieldsToValidateOnChange = [name] } = {}
) => {
  let [value, setValue] = useState(defaultValue);
  let [errors, setErrors] = useState([]);
  let [pristine, setPristine] = useState(true);
  let [validating, setValidating] = useState(false);
  let validateCounter = useRef(0);

  const validate = async () => {
    let validateIteration = ++validateCounter.current;
    setValidating(true);
    let formData = form.getFormData();
    // 单个字段的校验
    let errorMessages = await Promise.all(
      validations.map(validation => validation(formData, name))
    );
    // 筛选出不符合条件的规则
    errorMessages = errorMessages.filter(errorMsg => !!errorMsg);
    // 有可能被重复调用，只取最近一次调用
    if (validateIteration === validateCounter.current) {
      setErrors(errorMessages);
      setValidating(false);
    }
    let fieldValid = errorMessages.length === 0;
    return fieldValid;
  };

  useEffect(
    () => {
      if (pristine) return; // 避免渲染完成后的第一次校验
      // 值发生改变后校验其他字段
      form.validateFields(fieldsToValidateOnChange);
    },
    [value]
  );

  let field = {
    name,
    value,
    errors,
    setErrors,
    pristine,
    onChange: e => {
      if (pristine) {
        setPristine(false);
      }
      setValue(getValueFromEvent(e));
    },
    validate,
    validating
  };
  form.addField(field);
  return field;
};

export const useForm = ({ onSubmit }) => {
  let [submitted, setSubmitted] = useState(false);
  let [submitting, setSubmitting] = useState(false);
  let fields = [];

  const validateFields = async fieldNames => {
    let fieldsToValidate;
    if (fieldNames instanceof Array) {
      fieldsToValidate = fields.filter(field =>
        fieldNames.includes(field.name)
      );
    } else {
      // 如果 fieldNames 缺省，则验证所有表单项
      fieldsToValidate = fields;
    }
    // 验证特定的一些字段或者所有字段
    let fieldsValid = await Promise.all(
      fieldsToValidate.map(field => field.validate())
    );
    // 返回验证结果
    let formValid = fieldsValid.every(isValid => isValid === true);
    return formValid;
  };

  const getFormData = () => {
    // 将字段数组转为字段对象值
    return fields.reduce((formData, f) => {
      formData[f.name] = f.value;
      return formData;
    }, {});
  };

  return {
    onSubmit: async () => {
      setSubmitting(true);
      setSubmitted(true); // 用户已经至少提交过一次表单
      let formValid = await validateFields();
      // 返回校验结果、表单数据
      let returnVal = await onSubmit(getFormData(), formValid);
      setSubmitting(false);
      return returnVal;
    },
    // 是否合法
    isValid: () => fields.every(f => f.errors.length === 0),
    // 手动添加字段
    addField: field => fields.push(field),
    getFormData,
    validateFields,
    submitted,
    submitting
  };
};
export function getValueFromEvent(...args) {
  const e = args[0];
  return e && e.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e
}
export const Field = ({
  field = {},
  form = {},
  children,
  ...other
}) => {
  const {
    label,
    name,
    value,
    onChange,
    errors = [],
    setErrors,
    pristine,
    validating,
    validate = () => true,
  } = field;
  const {
    formSubmitted
  } = form;
  // 没touched的或者提交过的、有错误字段时显示error
  let showErrors = (!pristine || formSubmitted) && !!errors.length;
  return (
    <View className="field" error={showErrors}>
      {cloneElement(children, {
        value,
        name,
        onChange,
        onBlur: () => !pristine && validate()
      })}
      <View>
        {/* 显示错误信息 */}
        {showErrors &&
          errors.map(errorMsg => <Text key={errorMsg}>{errorMsg}</Text>)}
      </View>
    </View>
  );
};

const App = props => {
  // 使用useForm hooks创建实例
  const form = useForm({
    // 传入onSubmit接收校验结果和表单数据
    onSubmit: async (formData, valid) => {
      if (!valid) return;
      await timeout(2000); // 模拟网络延迟
      if (formData.username.length < 10) {
        //模拟服务端返回 400
        usernameField.setErrors(["Make a longer username"]);
      } else {
        //模拟服务端返回 201
        window.alert(
          `form valid: ${valid}, form data: ${JSON.stringify(formData)}`
        );
      }
    }
  });

  // useField接收字段name和form实例，传入初始值和rules，以及当值发生改变时需要校验的其他字段
  const usernameField = useField("username", form, {
    defaultValue: "",
    validations: [
      async formData => {
        await timeout(2000);
        return formData.username.length < 6 && "Username already exists";
      }
    ],
    fieldsToValidateOnChange: []
  });
  const passwordField = useField("password", form, {
    defaultValue: "",
    validations: [
      formData =>
        formData.password.length < 6 && "Password must be at least 6 characters"
    ],
    fieldsToValidateOnChange: ["password", "confirmPassword"]
  });
  const confirmPasswordField = useField("confirmPassword", form, {
    defaultValue: "",
    validations: [
      formData =>
        formData.password !== formData.confirmPassword &&
        "Passwords do not match"
    ],
    fieldsToValidateOnChange: ["password", "confirmPassword"]
  });

  // 所有useField字段的集合
  let requiredFields = [usernameField, passwordField, confirmPasswordField];

  return (
    <div id="form-container">
      <form onSubmit={form.onSubmit}>
        <Field
          // 将所有返回的props赋到实际字段上
          {...usernameField}
          // submitted表示用户是否点击过提交
          formSubmitted={form.submitted}
          label="Username"
        ></Field>
        {/* <Field
          {...passwordField}
          formSubmitted={form.submitted}
          label="Password"
          type="password"
        />
        <Field
          {...confirmPasswordField}
          formSubmitted={form.submitted}
          label="Confirm Password"
          type="password"
        /> */}
        <Button
          type="submit"
          // 表单校验未通过、提交中、还有字段未填写的情况，提交按钮不可用
          disabled={
            !form.isValid() ||
            form.submitting ||
            requiredFields.some(f => f.pristine)
          }
        >
          {form.submitting ? "Submitting" : "Submit"}
        </Button>
      </form>
    </div>
  );
};
