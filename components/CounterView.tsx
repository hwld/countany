import { Alert } from "@material-ui/lab";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/client";
import React, { useEffect } from "react";
import styled from "styled-components";
import {
  useCountersResult,
  useLocalCounters,
  useRemoteCounters,
} from "../hooks/useCounters";
import { fetcher } from "../util/fetcher";
import { AddCounterButton } from "./AddCounterButton";
import { Counter } from "./Counter";

const Component: React.FC<{ className?: string }> = ({ className }) => {
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
    <div className={className}>
      <div className="counterAlert">
        {error && (
          <Alert className="alert" severity="error">
            {error.message}
          </Alert>
        )}
      </div>
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
                key={counter.id}
                className="counter"
                counter={counter}
                onEditCounter={editCounter}
                onRemoveCounter={removeCounter}
                onCountUp={countUp}
                onCountDown={countDown}
                onResetCount={resetCount}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <AddCounterButton onAddCounter={addCounter} className="addCounter" />
    </div>
  );
};

const StyledComponent = styled(Component)`
  margin-bottom: 100px;

  & > .counterAlert {
    position: fixed;
    top: 55px;
    height: 50px;
    width: 100%;
    z-index: 1;

    & .alert {
      width: 50%;
      margin: 0px auto;
    }
  }

  & > .counterContainer {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    & > div {
      margin: 5px;
    }
  }

  & > .addCounter {
    position: absolute;
    width: 56px;
    height: 56px;
    right: 20px;
    bottom: 20px;
  }
`;

export const CounterView = StyledComponent;
