import { TextField, Typography } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { CounterFields, counterMaxLength, CounterObj } from "./Counter";

type Props = {
  id: string;
  className?: string;
  counter?: CounterObj;
  onSubmit?: (fields: CounterFields) => void;
};

const Component: React.FC<Props> = ({
  id,
  className,
  counter,
  onSubmit: submit = () => {},
}) => {
  const {
    register,
    errors,
    handleSubmit,
    getValues,
    clearErrors,
    trigger,
  } = useForm<CounterFields>({
    defaultValues: {
      name: counter?.name || "カウンター",
      startWith: counter?.startWith || 0,
      amount: counter?.amount || 1,
      maxValue: counter?.maxValue || 9999999999,
      minValue: counter?.minValue || -9999999999,
    },
  });

  // TextFieldのnameに渡す文字列がCounterFieldsのフィールド名と一致していることを保証したい
  // CounterFieldsのフィールド名が変更されたらここがエラーになるはず.
  const name: keyof CounterFields = "name";
  const startWith: keyof CounterFields = "startWith";
  const amount: keyof CounterFields = "amount";
  const maxValue: keyof CounterFields = "maxValue";
  const minValue: keyof CounterFields = "minValue";

  const onSubmit = (fields: Record<keyof CounterFields, string>) => {
    submit({
      ...fields,
      startWith: Number(fields.startWith),
      amount: Number(fields.amount),
      maxValue: Number(fields.maxValue),
      minValue: Number(fields.minValue),
    });
  };

  const counterPatternRule = {
    value: new RegExp(`^(\\+|-){0,1}\\d{1,${counterMaxLength}}$`),
    message: `${counterMaxLength}桁以内の数字で入力してください`,
  };

  const inputProps = {
    autoComplete: "off",
  };

  const validationName = {
    startLessOrEqualMax: "startLessOrEqualMax",
    startGreaterOrEqualMin: "startGreaterOrEqualMin",
    maxGreaterOrEqualMin: "maxGreaterOrEqualMin",
  };

  const includeInValidationName = (name: string | undefined) => {
    return (
      validationName.startLessOrEqualMax === name ||
      validationName.startGreaterOrEqualMin === name ||
      validationName.maxGreaterOrEqualMin === name
    );
  };

  const validateStartLessOrEqualMax = () => {
    if (Number(getValues(startWith)) <= Number(getValues(maxValue))) {
      if (errors.startWith?.type === validationName.startLessOrEqualMax) {
        clearErrors(startWith);
        trigger(startWith);
      }
      if (errors.maxValue?.type === validationName.startLessOrEqualMax) {
        clearErrors(maxValue);
        trigger(maxValue);
      }
      return true;
    }
    return false;
  };

  const validateStartGreaterOrEqualMin = () => {
    if (Number(getValues(startWith)) >= Number(getValues(minValue))) {
      if (errors.startWith?.type === validationName.startGreaterOrEqualMin) {
        clearErrors(startWith);
        trigger(startWith);
      }
      if (errors.minValue?.type === validationName.startGreaterOrEqualMin) {
        clearErrors(minValue);
        trigger(minValue);
      }
      return true;
    }
    return false;
  };

  const validateMaxGreaterOrEqualMin = () => {
    if (Number(getValues(maxValue)) >= Number(getValues(minValue))) {
      if (errors.maxValue?.type === validationName.maxGreaterOrEqualMin) {
        clearErrors(maxValue);
        trigger(maxValue);
      }
      if (errors.minValue?.type === validationName.maxGreaterOrEqualMin) {
        clearErrors(minValue);
        trigger(minValue);
      }
      return true;
    }
    return false;
  };

  return (
    <form id={id} className={className} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        className="formField"
        label="カウンター名"
        placeholder="50文字以内で入力してください"
        inputProps={inputProps}
        inputRef={register({
          required: "カウンター名を入力してください",
          maxLength: {
            value: 50,
            message: "50文字以内で入力してください",
          },
        })}
        name={name}
        error={errors.name ? true : false}
      />
      <div className="errorField">
        <Typography className="errorText">{errors.name?.message}</Typography>
      </div>
      <TextField
        className="formField"
        label="初期値"
        inputProps={inputProps}
        inputRef={register({
          required: "初期値を入力してください",
          pattern: counterPatternRule,
          // 初期値 <= 最大値
          // 初期値 >= 最小値
          validate: {
            [validationName.startLessOrEqualMax]: validateStartLessOrEqualMax,
            [validationName.startGreaterOrEqualMin]: validateStartGreaterOrEqualMin,
          },
        })}
        name={startWith}
        error={errors.startWith ? true : false}
      />
      <div className="errorField">
        <Typography className="errorText">
          {errors.startWith?.message}
        </Typography>
      </div>
      <TextField
        className="formField"
        label="増減量"
        inputProps={inputProps}
        inputRef={register({
          required: "増減量を入力してください",
          pattern: counterPatternRule,
        })}
        name={amount}
        error={errors.amount ? true : false}
      />
      <div className="errorField">
        <Typography className="errorText">{errors.amount?.message}</Typography>
      </div>
      <TextField
        className="formField"
        label="最大値"
        inputProps={inputProps}
        inputRef={register({
          required: "最大値を入力してください",
          pattern: counterPatternRule,
          // 初期値 <= 最大値
          // 最大値 >= 最小値
          validate: {
            [validationName.startLessOrEqualMax]: validateStartLessOrEqualMax,
            [validationName.maxGreaterOrEqualMin]: validateMaxGreaterOrEqualMin,
          },
        })}
        name={maxValue}
        error={errors.maxValue ? true : false}
      />
      <div className="errorField">
        <Typography className="errorText">
          {errors.maxValue?.message}
        </Typography>
      </div>
      <TextField
        className="formField"
        label="最小値"
        inputProps={{ autoComplete: "off" }}
        inputRef={register({
          required: "最小値を入力してください",
          pattern: counterPatternRule,
          // 初期値 >= 最小値
          // 最大値 >= 最小値
          validate: {
            [validationName.startGreaterOrEqualMin]: validateStartGreaterOrEqualMin,
            [validationName.maxGreaterOrEqualMin]: validateMaxGreaterOrEqualMin,
          },
        })}
        name={minValue}
        error={errors.minValue ? true : false}
      />
      <div className="errorField">
        <Typography className="errorText">
          {errors.minValue?.message}
        </Typography>
      </div>
      <div className="optionErrorField">
        <Typography className="errorText">
          {(includeInValidationName(errors.startWith?.type) ||
            includeInValidationName(errors.maxValue?.type) ||
            includeInValidationName(errors.minValue?.type)) &&
            "最小値 <= 初期値 <= 最大値　になるように入力してください"}
        </Typography>
      </div>
    </form>
  );
};

const StyledComponent = styled(Component)`
  display: flex;
  flex-direction: column;

  & > .formField {
    margin-top: 5%;
  }

  & > .errorField {
    height: 1.1rem;
    & > .errorText {
      font-size: 0.9rem;
      color: ${(props) => props.theme.palette.error.main};
    }
  }

  & > .optionErrorField {
    margin-top: 2%;
    height: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & > .errorText {
      font-size: 1rem;
      color: ${(props) => props.theme.palette.error.main};
    }
  }
`;

export const CounterSettingForm = StyledComponent;
