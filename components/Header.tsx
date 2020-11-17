import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";
import { signIn, signOut, useSession } from "next-auth/client";
import React from "react";
import styled from "styled-components";

const Component: React.FC<{ className?: string }> = ({ className }) => {
  const [session] = useSession();

  const login = () => {
    signIn("google");
  };

  const logout = () => {
    // callbackUrlは絶対urlで指定する必要があるが、適当な文字列を渡すとホームに戻る
    signOut({ callbackUrl: "/" });
  };

  return (
    <AppBar className={className}>
      <Toolbar>
        <Typography variant="h5" className={`${className}_title`}>
          Countany
        </Typography>
        {session ? (
          <Button onClick={logout} variant="outlined" color="default">
            ログアウト
          </Button>
        ) : (
          <Button onClick={login} variant="outlined" color="default">
            ログイン
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

const StyledComponent = styled(Component)`
  &_title {
    flex-grow: 1;
  }

  &_iconButton {
    width: 48px;
    height: 48px;
    & img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
`;

export const Header = StyledComponent;
