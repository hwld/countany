import React, { useEffect } from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { AddCounterButton } from "../components/AddCounterButton";
import {
  useCountersResults,
  useLocalCounters,
  useRemoteCounters,
} from "../util/hooks";
import { useSession } from "next-auth/client";
import { NextPage } from "next";
import { AnimatePresence, motion } from "framer-motion";
import { Counter } from "../components/Counter";

const Home: NextPage<{ className?: string }> = ({ className }) => {
  const [session] = useSession();

  const remote = useRemoteCounters();
  const local = useLocalCounters();
  const {
    counters,
    addCounter,
    removeCounter,
    editCounter,
    countUp,
    countDown,
    resetCount,
  }: useCountersResults = session ? remote : local;

  // sessionが存在し、localstorageにカウンターが存在するときにはカウンターをdbに保存する
  useEffect(() => {
    const moveLocalToRemote = async () => {
      //先にclearする
      local.clearCounters();

      // clearしたがここではまだcountersは参照できる
      await remote.addCounters(local.counters);
    };

    if (session && local.counters.length > 0) {
      moveLocalToRemote();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <div className={className}>
      <Header />
      <Main>
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
  );
};

const StyledHome = styled(Home)`
  height: 100vh;
  background-color: ${(props) => {
    return props.theme.palette.background.default;
  }};

  & .counterContainer {
    margin: 20px 100px 0 20px;
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
