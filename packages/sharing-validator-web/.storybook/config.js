import React from "react";
import { configure, addDecorator } from "@storybook/react";
import GlobalStyles from "../components/GlobalStyles";

addDecorator(storyFn => (
  <>
    <GlobalStyles />
    {storyFn()}
  </>
));

// automatically import all files ending in *.stories.js
configure(require.context("../", true, /\.stories\.js$/), module);
