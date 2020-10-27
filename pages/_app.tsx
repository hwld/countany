import { AppProps } from "next/dist/next-server/lib/router/router";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import "../styles/globals.css";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box
  }
`;

const theme = {};

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default MyApp;
