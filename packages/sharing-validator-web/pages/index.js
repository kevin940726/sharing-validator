import React from "react";
import Head from "next/head";
import { css } from "styled-components";
import sharingValidator from "sharing-validator";
import Hero from "../components/Hero";
import ResultList from "../components/ResultList";

const App = ({ query, results, error }) => {
  return (
    <main
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Head>
        <title>Sharing Validator</title>
        <meta
          name="description"
          content="Validate best practices for social sharing URLs"
        />
        <meta property="og:title" content="Sharing Validator" />
        <meta
          property="og:description"
          content="Validate best practices for social sharing URLs"
        />
        <meta property="og:url" content="https://sharing-validator.now.sh" />
        <meta property="og:type" content="website" />
      </Head>

      <Hero query={query} />

      {results && <ResultList results={results} />}

      {error && (
        <pre
          css={css`
            width: 680px;
            max-width: 100%;
            padding: 20px;
            word-wrap: break-word;
            white-space: pre-wrap;
            color: #f44336;
          `}
        >
          {error}
        </pre>
      )}
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

  try {
    const { meta, results } = await sharingValidator(url, options);

    return {
      query,
      meta,
      results
    };
  } catch (err) {
    console.error(err);

    return {
      query,
      error: err.toString()
    };
  }
};

export default App;
