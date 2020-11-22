import { Alert } from "@material-ui/lab";
import React from "react";
import styled from "styled-components";
import { useCountersErrorType } from "../util/hooks";

type Props = { className?: string; errorType: useCountersErrorType };

const Component: React.FC<Props> = ({ className, errorType }) => {
  const errorText = () => {
    switch (errorType) {
      case "addCounter":
        return "カウンターの作成でエラーが発生しました。";
      case "removeCounter":
        return "カウンターの削除でエラーが発生しました。";
      case "editCounter":
        return "カウンターの編集でエラーが発生しました。";
      case "countUp":
        return "カウントアップでエラーが発生しました。";
      case "countDown":
        return "カウントダウンでエラーが発生しました。";
      case "resetCount":
        return "カウンターのリセットでエラーが発生しました。";
    }
  };

  return (
    <div className={className}>
      <Alert className="alert" severity="error">
        {errorText()}
      </Alert>
    </div>
  );
};

const StyledComponent = styled(Component)`
  position: fixed;
  width: 100%;
  z-index: 1;

  & .alert {
    width: 50%;
    margin: 10px auto;
  }
`;

export const ErrorAlert = StyledComponent;
