import React from "react";
import styled, { css } from "styled-components";
import enterIcon from "../assets/corner-down-left.svg";

const URLInput = props => (
  <div
    css={css`
      display: flex;
      position: relative;
      height: 54px;
      margin-bottom: 20px;
    `}
  >
    <input
      css={css`
        box-sizing: border-box;
        padding: 12px 20px 14px;
        border: 1px solid #00d1b2;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-right: none;
        background-color: #ffffff;
        height: 100%;
        width: 100%;
        font-size: 24px;
        flex-grow: 1;

        &:focus {
          box-shadow: 0 0 0 0.125em rgba(0, 209, 178, 0.25);
          outline: none;
        }
      `}
      autoCorrect="off"
      spellCheck="off"
      placeholder="sharing-validator.now.sh"
      name="url"
      {...props}
    />

    <button
      type="submit"
      css={css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 54px;
        border: none;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        background-color: #00d1b2;

        &:hover {
          background-color: #00c4a7;
        }

        &:focus {
          box-shadow: 0 0 0 0.125em rgba(0, 209, 178, 0.25);
          outline: none;
        }
      `}
    >
      <img src={enterIcon} alt="Validate" width="20" height="20" />
    </button>
  </div>
);

export default URLInput;
