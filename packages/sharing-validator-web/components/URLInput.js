import React from "react";
import styled, { css } from "styled-components";

const URLInput = props => (
  <input
    css={css`
      display: flex;
      position: relative;
      box-sizing: border-box;
      padding: 12px 20px 14px;
      border: 1px solid rgba(0, 0, 0, 0.38);
      border-radius: 4px;
      background-color: #ffffff;
      height: 100%;
      width: 100%;
      font-size: 24px;
      margin-bottom: 20px;
    `}
    autoCorrect="off"
    spellCheck="off"
    placeholder="sharing-validator.now.sh"
    name="url"
    {...props}
  />
);

export default URLInput;
