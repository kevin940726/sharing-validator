import React from "react";
import NextApp from "next/app";
import GlobalStyles from "../components/GlobalStyles";

class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <GlobalStyles />
        <Component {...pageProps} />
      </>
    );
  }
}

export default App;
