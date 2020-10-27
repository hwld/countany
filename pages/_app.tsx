import { useEffect } from "react";
import { AppProps } from "next/dist/next-server/lib/router/router";
import { ThemeProvider as ScThemeProvider } from "styled-components";
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core";
import { GlobalStyle } from "../styles/globalStyle";
import { theme } from "../styles/theme";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
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
          <Component {...pageProps} />
        </ScThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
};

export default MyApp;
