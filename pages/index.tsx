import React from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { CounterContainer } from "../components/CounterContainer";
import { AddCounterButton } from "../components/AddCounterButton";
import { useCounters } from "../util/hooks";
import { getSession } from "next-auth/client";
import { GetServerSideProps, NextPage } from "next";

// サーバーサイドでsessionをProviderに入れて、すでにログインされているときにクライアント側でundefinedを返さないようにする
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  return { props: { session } };
};

const Home: NextPage<{ className?: string }> = ({ className }) => {
  const {
    counters,
    addCounter,
    removeCounter,
    editCounter,
    countUp,
    countDown,
    resetCount,
  } = useCounters();

  return (
    <div className={className}>
      <Header />
      <Main>
        <CounterContainer
          counters={counters}
          onEditCounter={editCounter}
          onRemoveCounter={removeCounter}
          onCountUp={countUp}
          onCountDown={countDown}
          onResetCount={resetCount}
        />
      </Main>
      <AddCounterButton onAddCounter={addCounter} className="addCounter" />
    </div>
  );
};

const StyledHome = styled(Home)`
  height: 100vh;
  background-color: ${(props) => {
    return props.theme.palette.background.default;
  }};

  & .addCounter {
    position: absolute;
    right: 40px;
    bottom: 40px;
  }
`;

export default StyledHome;
