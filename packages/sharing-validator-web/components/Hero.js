import React from "react";
import { css } from "styled-components";
import URLInput from "./URLInput";
import Features from "./Features";

function getDefaultOption(query, key, defaultValue) {
  return query[key] ? query[key] === "on" : defaultValue;
}

const optionsReducer = (options, feature) => {
  return {
    ...options,
    [feature]: !options[feature]
  };
};

const Hero = ({ query }) => {
  const [options, toggleFeature] = React.useReducer(optionsReducer, {
    facebook: getDefaultOption(query, "facebook", true),
    twitter: getDefaultOption(query, "twitter", true),
    AASA: getDefaultOption(query, "AASA", false),
    assetlinks: getDefaultOption(query, "assetlinks", false),
    facebookAppLinkIOS: getDefaultOption(query, "facebookAppLinkIOS", false),
    facebookAppLinkAndroid: getDefaultOption(
      query,
      "facebookAppLinkAndroid",
      false
    )
  });
  const [input, setInput] = React.useState(query.url || "");

  return (
    <form
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 120px 60px 60px;
        text-align: center;
        width: 800px;
        max-width: 100%;
      `}
    >
      <h1
        css={css`
          font-size: 72px;
          font-weight: lighter;
          margin-bottom: 0;
        `}
      >
        Sharing Validator
      </h1>
      <h2
        css={css`
          font-size: 18px;
          font-weight: normal;
          margin-bottom: 32px;
        `}
      >
        Validate best practices for social sharing URLs
      </h2>
      <URLInput value={input} onChange={e => setInput(e.currentTarget.value)} />
      <Features options={options} toggleFeature={toggleFeature} />

      <button
        type="submit"
        css={css`
          align-self: center;
          border: 1px solid #999;
          padding: 10px 20px;
        `}
      >
        Validate
      </button>
    </form>
  );
};

export default Hero;
