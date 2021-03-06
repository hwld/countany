import React from "react";
import { useEffect } from "react";
import { AppProps } from "next/dist/next-server/lib/router/router";
import { ThemeProvider as ScThemeProvider } from "styled-components";
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core";
import { GlobalStyle } from "../styles/globalStyle";
import { Provider as SessionProvider } from "next-auth/client";
import { theme } from "../styles/theme";
import { NextPage } from "next";

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  //useEffectはクライアントサイドでのみ実行される
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <StylesProvider injectFirst>
      <GlobalStyle />
      <MuiThemeProvider theme={theme}>
        <ScThemeProvider theme={theme}>
          <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
          </SessionProvider>
        </ScThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
};

export default MyApp;
