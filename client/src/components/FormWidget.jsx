import React, { Fragment, useRef, useState, useEffect } from 'react';
import Taro, { useShareAppMessage, useRouter } from '@tarojs/taro';
import { View, Text, Button, Form } from '@tarojs/components';
import { AtButton, AtInput, AtFab, AtIcon, AtBadge, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui';
import { useRedux } from '@/reducer';
import consts from '@/const';

const log = console.log;

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
    let errorMessages = await Promise.all(
      validations.map(validation => validation(formData, name))
    );
    errorMessages = errorMessages.filter(errorMsg => !!errorMsg);
    if (validateIteration === validateCounter.current) {
      // 最近一次调用
      setErrors(errorMessages);
      setValidating(false);
    }
    let fieldValid = errorMessages.length === 0;
    return fieldValid;
  };

  useEffect(
    () => {
      if (pristine) return; // 避免渲染完成后的第一次校验
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
      setValue(e.target.value);
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
    let fieldsValid = await Promise.all(
      fieldsToValidate.map(field => field.validate())
    );
    let formValid = fieldsValid.every(isValid => isValid === true);
    return formValid;
  };

  const getFormData = () => {
    return fields.reduce((formData, f) => {
      formData[f.name] = f.value;
      return formData;
    }, {});
  };

  return {
    onSubmit: async e => {
      e.preventDefault();
      setSubmitting(true);
      setSubmitted(true); // 用户已经至少提交过一次表单
      let formValid = await validateFields();
      let returnVal = await onSubmit(getFormData(), formValid);
      setSubmitting(false);
      return returnVal;
    },
    isValid: () => fields.every(f => f.errors.length === 0),
    addField: field => fields.push(field),
    getFormData,
    validateFields,
    submitted,
    submitting
  };
};

export const FormField = ({
  label,
  name,
  value,
  onChange,
  errors,
  setErrors,
  pristine,
  validating,
  validate,
  formSubmitted,
  Widget,
  ...props
}) => {
  let showErrors = (!pristine || formSubmitted) && !!errors.length;
  return (
    // <FormControl className="field" error={showErrors}>
    <Widget
      value={value}
      onChange={onChange}
      onBlur={() => !pristine && validate()}
      // endAdornment={
      //   <InputAdornment position="end">
      //     {validating && <LoadingIcon className="rotate" />}
      //   </InputAdornment>
      // }
      {...props}
    />
    //   <FormHelperText component="div">
    //     {showErrors &&
    //       errors.map(errorMsg => <div key={errorMsg}>{errorMsg}</div>)}
    //   </FormHelperText>
    // </FormControl>
  );
};

const Example = props => {
  const form = useForm({
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

  let requiredFields = [usernameField, passwordField, confirmPasswordField];

  return (
    <div id="form-container">
      <form onSubmit={form.onSubmit}>
        <FormField
          {...usernameField}
          formSubmitted={form.submitted}
          label="Username"
        />
        <FormField
          {...passwordField}
          formSubmitted={form.submitted}
          label="Password"
          type="password"
        />
        <FormField
          {...confirmPasswordField}
          formSubmitted={form.submitted}
          label="Confirm Password"
          type="password"
        />
        <Button
          type="submit"
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
