import React from "react";
import styled, { css } from "styled-components";
import validIcon from "../assets/check.svg";
import errorIcon from "../assets/x.svg";
import warningIcon from "../assets/alert-triangle.svg";
import { FEATURES_ORDER, NAMES } from "../constants/features";
import { mobile } from "../utils/media";

const Property = styled.span`
  width: 150px;
  flex-shrink: 0;
  font-weight: bold;
  margin-right: 10px;

  ${mobile(css`
    flex-grow: 1;
  `)}
`;

const Content = ({ property, children }) => {
  let content = children;

  if (typeof children === "undefined") {
    content = (
      <span
        css={css`
          color: #999999;
        `}
      >
        undefined
      </span>
    );
  } else if (
    property === "apple-app-site-association" ||
    property === "assetlinks.json"
  ) {
    content = (
      <span
        css={css`
          font-weight: bold;
        `}
      >
        {children}
      </span>
    );
  } else {
    content = JSON.stringify(content, null, 2);
  }

  return (
    <span
      css={css`
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
        min-width: 0;
        word-break: break-word;

        ${mobile(css`
          flex-shrink: 0;
          flex-basis: 100%;
          width: 100%;
          min-width: 100%;
          margin-top: 10px;
        `)}
      `}
    >
      {content}
    </span>
  );
};

const Icon = ({ valid, type }) => {
  let children;
  if (valid) {
    children = <img src={validIcon} alt="valid" />;
  } else if (type === "warning") {
    children = <img src={warningIcon} alt="warning" />;
  } else {
    children = <img src={errorIcon} alt="error" />;
  }

  return (
    <span
      css={css`
        width: 30px;
        text-align: center;
        flex-shrink: 0;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-right: 8px;
      `}
    >
      {children}
    </span>
  );
};

const ErrorMessage = styled.div`
  flex-grow: 1;
  width: 100%;
  color: #f44336;
  margin-top: 10px;
  padding: 0 5px 0 198px;

  ${mobile(css`
    padding: 0;
  `)}
`;

const Result = ({ feature, result }) => {
  return (
    <li>
      <h3
        css={css`
          padding: 12px 20px;
          background-color: #00d1b2;
          margin: 0;
          color: #ffffff;
        `}
      >
        {NAMES[feature]}
      </h3>

      <ul
        css={css`
          padding: 0;
        `}
      >
        {result.validations
          .filter(validation => validation.content || !validation.valid)
          .map(validation => (
            <li
              key={validation.property}
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                padding: 10px 20px;

                & + & {
                  border-top: 1px solid #eee;
                }

                ${mobile(css`
                  justify-content: flex-start;
                `)}
              `}
            >
              <Icon valid={validation.valid} type={validation.type} />
              <Property>{validation.property}</Property>
              <Content property={validation.property}>
                {validation.content}
              </Content>
              {!validation.valid && validation.message && (
                <ErrorMessage>{validation.message}</ErrorMessage>
              )}
            </li>
          ))}
      </ul>
    </li>
  );
};

const ResultList = ({ results }) => {
  return (
    <ul
      css={css`
        list-style: none;
        padding: 0;
        width: 860px;
        max-width: 100%;
        margin-bottom: 60px;
      `}
    >
      {FEATURES_ORDER.filter(feature => results[feature]).map(feature => (
        <Result key={feature} feature={feature} result={results[feature]} />
      ))}
    </ul>
  );
};

export default ResultList;
