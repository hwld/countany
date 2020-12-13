import React from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { CounterView } from "../components/CounterView";
import { getSession } from "next-auth/client";

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

// サーバーサイドでセッションを確認し、セッションが存在するときにクライアント側で最初からsessionが存在するようにする
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  return { props: { session } };
};

export default StyledHome;
