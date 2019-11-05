import React from "react";
import { css } from "styled-components";
import { FEATURES_ORDER, NAMES } from "../constants/features";
import { mobile } from "../utils/media";

const Feature = ({ children, feature, ...props }) => (
  <label
    css={css`
      display: inline-flex;
      align-items: center;
      margin: 5px;
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
      grid-template-columns: repeat(3, auto);
      grid-template-rows: repeat(2, 1fr);
      grid-column-gap: 0;
      grid-row-gap: 5px;
      grid-auto-flow: column;
      width: 600px;
      max-width: 100%;
      margin: 0 auto 20px;

      ${mobile(css`
        grid-template-columns: repeat(1, auto);
        grid-template-rows: repeat(6, 1fr);
      `)}
    `}
  >
    {FEATURES_ORDER.filter(feature => options.hasOwnProperty(feature)).map(
      feature => (
        <Feature
          key={feature}
          feature={feature}
          checked={options[feature]}
          onChange={() => toggleFeature(feature)}
        >
          {NAMES[feature]}
        </Feature>
      )
    )}
  </div>
);

export default Features;
