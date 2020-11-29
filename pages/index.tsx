import React, { useEffect } from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { AddCounterButton } from "../components/AddCounterButton";
import { NextPage } from "next";
import { AnimatePresence, motion } from "framer-motion";
import { Counter } from "../components/Counter";
import Head from "next/head";
import { useSession } from "next-auth/client";
import {
  useCountersResult,
  useLocalCounters,
  useRemoteCounters,
} from "../hooks/useCounters";
import { fetcher } from "../util/fetcher";
import { Alert } from "@material-ui/lab";

const Home: NextPage<{ className?: string }> = ({ className }) => {
  const session = Boolean(useSession()[0]);

  const remote = useRemoteCounters(fetcher);
  const local = useLocalCounters();
  const {
    counters,
    error,
    addCounter,
    removeCounter,
    editCounter,
    countUp,
    countDown,
    resetCount,
  }: useCountersResult = session ? remote : local;

  // ログイン時にlocalのカウンターをremoteに追加する
  useEffect(() => {
    const moveLocalToRemote = async () => {
      // 先にclearして、promiseが解決していないときにレンダリングされても正しく動くようにする
      local.clearCounters();
      await remote.addCounters(local.counters);
    };
    if (session && local.counters.length > 0) {
      moveLocalToRemote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <Head>
        <title>Countany</title>
      </Head>
      <div className={className}>
        <Header />
        <Main>
          {error && (
            <div className="errorAlertContainer">
              <Alert className="alert" severity="error">
                {error.message}
              </Alert>
            </div>
          )}
          <div className="counterContainer">
            <AnimatePresence>
              {counters.map((counter) => (
                <motion.div
                  key={counter.id}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Counter
                    className="counter"
                    counter={counter}
                    onEditCounter={editCounter}
                    onRemoveCounter={removeCounter}
                    onCountUp={countUp}
                    onCountDown={countDown}
                    onResetCount={resetCount}
                  ></Counter>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Main>
        <AddCounterButton onAddCounter={addCounter} className="addCounter" />
      </div>
    </>
  );
};

const StyledHome = styled(Home)`
  height: 100vh;
  background-color: ${(props) => {
    return props.theme.palette.background.default;
  }};

  & .errorAlertContainer {
    position: fixed;
    height: 50px;
    width: 100%;
    z-index: 1;

    & .alert {
      width: 50%;
      margin: 10px auto;
    }
  }

  & .counterContainer {
    margin: 65px 100px 0 20px;
    display: flex;
    flex-wrap: wrap;

    & > div {
      margin: 5px;
    }
  }

  & .addCounter {
    position: absolute;
    right: 40px;
    bottom: 40px;
  }
`;

export default StyledHome;
