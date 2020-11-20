import React, { useEffect } from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { AddCounterButton } from "../components/AddCounterButton";
import { useCounters } from "../util/hooks";
import { NextPage } from "next";
import { AnimatePresence, motion } from "framer-motion";
import { Counter } from "../components/Counter";
import { Alert } from "@material-ui/lab";

const Home: NextPage<{ className?: string }> = ({ className }) => {
  const {
    counters,
    error,
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
        {error && (
          <div className="alertContainer">
            <Alert className="errorAlert" severity="error">
              エラーが発生しました。
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
  );
};

const StyledHome = styled(Home)`
  height: 100vh;
  background-color: ${(props) => {
    return props.theme.palette.background.default;
  }};

  & .alertContainer {
    position: fixed;
    width: 100%;
    height: 50px;
    z-index: 1;

    & .errorAlert {
      width: 50%;
      margin: 15px auto;
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
