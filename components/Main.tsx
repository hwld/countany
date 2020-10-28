import React from "react";
import { Toolbar } from "@material-ui/core";
import styled from "styled-components";

const Component: React.FC<{ className?: string }> = ({
  className,
  children,
}) => {
  return (
    <main className={className}>
      <Toolbar />
      {children}
    </main>
  );
};

const StyledComponent = styled(Component)`
  overflow: auto;
  height: 100%;
`;

export const Main = StyledComponent;
