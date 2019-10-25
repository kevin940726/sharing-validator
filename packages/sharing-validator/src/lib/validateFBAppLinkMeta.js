import validateMeta from "./validateMeta";
import { STRING_PATTERN_REQUIRED } from "../utils/validationPatterns";

const URI_SCHEME_PATTERN = /^.+:\/\/.*$/;

const FB_APP_LINK_IOS_VALIDATE_PATTERNS = {
  al: {
    ios: {
      app_name: STRING_PATTERN_REQUIRED,
      app_store_id: STRING_PATTERN_REQUIRED,
      url: URI_SCHEME_PATTERN
    },
    web: {
      should_fallback: /^false$/
    }
  }
};

const FB_APP_LINK_ANDROID_VALIDATE_PATTERNS = {
  al: {
    android: {
      app_name: STRING_PATTERN_REQUIRED,
      package: STRING_PATTERN_REQUIRED,
      url: URI_SCHEME_PATTERN
    }
  }
};

function validateFBAppLinkMeta(meta, { ios = false, android = false } = {}) {
  const results = {};

  if (ios) {
    results.ios = validateMeta(meta, FB_APP_LINK_IOS_VALIDATE_PATTERNS);
  }
  if (android) {
    results.android = validateMeta(meta, FB_APP_LINK_ANDROID_VALIDATE_PATTERNS);
  }

  return results;
}

export default validateFBAppLinkMeta;
