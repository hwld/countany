import React from "react";
import styled from "styled-components";
import { Counter } from "../components/Counter";

const Home: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <Counter />
    </div>
  );
};

const StyledHome = styled(Home)`
  height: 100vh;
  background-color: ${(props) => {
    return props.theme.palette.background.default;
  }};
`;

export default StyledHome;
