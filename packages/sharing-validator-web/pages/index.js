import React from "react";
import Head from "next/head";
import { css } from "styled-components";
import sharingValidator from "sharing-validator";
import Hero from "../components/Hero";
import ResultList from "../components/ResultList";

const App = ({ query, results }) => {
  return (
    <main
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Hero query={query} />

      <ResultList results={results} />
    </main>
  );
};

App.getInitialProps = async ({ query }) => {
  const {
    url,
    facebook,
    twitter,
    AASA,
    assetlinks,
    facebookAppLinkIOS,
    facebookAppLinkAndroid
  } = query;

  if (!url) {
    return { query, url: "", results: {} };
  }

  const options = {
    facebook: facebook === "on",
    twitter: twitter === "on",
    AASA: AASA === "on",
    assetlinks: assetlinks === "on",
    facebookAppLinkIOS: facebookAppLinkIOS === "on",
    facebookAppLinkAndroid: facebookAppLinkAndroid === "on"
  };

  const { meta, results } = await sharingValidator(url, options);

  return {
    query,
    meta,
    results
  };
};

export default App;
