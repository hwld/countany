import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { ServerStyleSheet as scServerStyleSheet } from "styled-components";
import { ServerStyleSheets as muiServerStyleSheet } from "@material-ui/core";
import React from "react";

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const scSheet = new scServerStyleSheet();
    const muiSheets = new muiServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            scSheet.collectStyles(muiSheets.collect(<App {...props} />)),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <React.Fragment key="styles">
            {initialProps.styles}
            {scSheet.getStyleElement()}
            {muiSheets.getStyleElement()}
          </React.Fragment>
        ),
      };
    } finally {
      scSheet.seal();
    }
  }

  render(): JSX.Element {
    return (
      <Html lang="ja-JP">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
