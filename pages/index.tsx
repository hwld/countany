import React from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { NextPage } from "next";
import Head from "next/head";
import { CounterView } from "../components/CounterView";

const Home: NextPage<{ className?: string }> = ({ className }) => {
  return (
    <>
      <Head>
        <title>Countany</title>
      </Head>
      <div className={className}>
        <Header />
        <Main>
          <CounterView />
        </Main>
      </div>
    </>
  );
};

const StyledHome = styled(Home)`
  height: 100vh;
  background-color: ${(props) => {
    return props.theme.palette.background.default;
  }};
`;

export default StyledHome;
