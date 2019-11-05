import preval from "preval.macro";

export const FEATURES_ORDER = [
  "og",
  "facebook",
  "twitter",
  "AASA",
  "assetlinks",
  "facebookAppLinkIOS",
  "facebookAppLinkAndroid"
];

export const NAMES = preval`
  const { NAMES } = require('sharing-validator');
  module.exports = NAMES;
`;
