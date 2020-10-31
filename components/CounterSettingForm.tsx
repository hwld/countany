import { TextField, Typography } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { start } from "repl";
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
  const { register, errors, handleSubmit, getValues } = useForm<
    CounterFields
  >();

  const onSubmit = (fields: Record<keyof CounterFields, string>) => {
    submit({
      ...fields,
      startWith: Number(fields.startWith),
      amount: Number(fields.amount),
      maxValue: Number(fields.maxValue),
      minValue: Number(fields.minValue),
    });
  };

  // TextFieldのnameに渡す文字列がCounterFieldsのフィールド名と一致していることを保証したい
  // CounterFieldsのフィールド名が変更されたらここがエラーになるはず.
  const name: keyof CounterFields = "name";
  const startWith: keyof CounterFields = "startWith";
  const amount: keyof CounterFields = "amount";
  const maxValue: keyof CounterFields = "maxValue";
  const minValue: keyof CounterFields = "minValue";

  const counterPatternRule = {
    value: new RegExp(`^(\\+|-){0,1}\\d{1,${counterMaxLength}}$`),
    message: `記号を含めないで${counterMaxLength}桁以内の数字で入力してください`,
  };

  return (
    <form id={id} className={className} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        className="formField"
        label="カウンター名"
        placeholder="50文字以内で入力してください"
        variant="filled"
        color="secondary"
        defaultValue={counter?.name}
        inputProps={{ autoComplete: "off" }}
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
      <Typography className="errorText">{errors.name?.message}</Typography>
      <TextField
        className="formField"
        label="初期値"
        variant="filled"
        color="secondary"
        defaultValue={counter?.startWith || 0}
        inputRef={register({
          required: "初期値を入力してください",
          pattern: counterPatternRule,
          validate: (value) => {
            const start = Number(value);
            const max = Number(getValues(maxValue));
            const min = Number(getValues(minValue));
            return (
              (start <= max && start >= min) ||
              "最大値以下で最小値以上の値を設定してください"
            );
          },
        })}
        name={startWith}
        error={errors.startWith ? true : false}
      />
      <Typography className="errorText">{errors.startWith?.message}</Typography>
      <TextField
        className="formField"
        label="増減量"
        variant="filled"
        color="secondary"
        defaultValue={counter?.amount || 1}
        inputRef={register({
          required: "増減量を入力してください",
          pattern: counterPatternRule,
        })}
        name={amount}
        error={errors.amount ? true : false}
      />
      <Typography className="errorText">{errors.amount?.message}</Typography>
      <TextField
        className="formField"
        label="最大値"
        variant="filled"
        color="secondary"
        defaultValue={counter?.maxValue || 9999999999}
        inputRef={register({
          required: "最大値を入力してください",
          pattern: counterPatternRule,
          validate: (value) => {
            const start = Number(getValues(startWith));
            const max = Number(value);
            const min = Number(getValues(minValue));
            return (
              (max >= start && max > min) ||
              "初期値以上で最小値より大きい値を入力してください"
            );
          },
        })}
        name={maxValue}
        error={errors.maxValue ? true : false}
      />
      <Typography className="errorText">{errors.maxValue?.message}</Typography>
      <TextField
        className="formField"
        label="最小値"
        variant="filled"
        color="secondary"
        defaultValue={counter?.minValue || -9999999999}
        inputRef={register({
          required: "最小値を入力してください",
          pattern: counterPatternRule,
          validate: (value) => {
            const start = Number(getValues(startWith));
            const max = Number(getValues(maxValue));
            const min = Number(value);
            return (
              (min <= start && min < max) ||
              "初期値以下で最大値より小さい値を入力してください"
            );
          },
        })}
        name={minValue}
        error={errors.minValue ? true : false}
      />
      <Typography className="errorText">{errors.minValue?.message}</Typography>
    </form>
  );
};

const StyledComponent = styled(Component)`
  display: flex;
  flex-direction: column;

  & > .formField {
    margin-top: 5%;
  }

  & > .errorText {
    font-size: 0.8rem;
    color: ${(props) => props.theme.palette.error.main};
  }

  & input[type="number"]::-webkit-inner-spin-button,
  & input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const CounterSettingForm = StyledComponent;
