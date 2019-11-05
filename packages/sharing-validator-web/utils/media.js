import { css } from "styled-components";

export const mobile = style => css`
  @media screen and (max-width: 1024px) {
    ${style}
  }
`;
