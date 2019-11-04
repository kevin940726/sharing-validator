import React from "react";
import { css } from "styled-components";
import { FEATURES_ORDER } from "../constants/features";

const FEATURES = [
  "facebook",
  "twitter",
  "AASA",
  "assetlinks",
  "facebookAppLinkIOS",
  "facebookAppLinkAndroid"
];

const Feature = ({ children, feature, ...props }) => (
  <label
    css={css`
      display: inline-flex;
      align-items: center;
      margin: 5px 10px;
    `}
  >
    <input
      type="checkbox"
      name={feature}
      css={css`
        margin-right: 5px;
      `}
      {...props}
    />
    {children}
  </label>
);

const Features = ({ options, toggleFeature }) => (
  <div
    css={css`
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 1fr);
      grid-column-gap: 10px;
      grid-row-gap: 5px;
      grid-auto-flow: column;
      width: 400px;
      margin: 0 auto 20px;
    `}
  >
    {FEATURES.filter(feature => options.hasOwnProperty(feature)).map(
      feature => (
        <Feature
          key={feature}
          feature={feature}
          checked={options[feature]}
          onChange={() => toggleFeature(feature)}
        >
          {feature}
        </Feature>
      )
    )}
  </div>
);

export default Features;
