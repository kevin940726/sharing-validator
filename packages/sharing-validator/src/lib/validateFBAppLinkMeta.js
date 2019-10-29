import validateMeta from "./validateMeta";
import {
  STRING_PATTERN,
  STRING_PATTERN_REQUIRED,
  URL_PATTERN
} from "../utils/validationPatterns";

const URI_SCHEME_PATTERN = /^(.+:\/\/.*|)$/;
const URI_SCHEME_PATTERN_REQUIRED = /^(.+:\/\/.*)$/;

const FB_APP_LINK_IOS_VALIDATE_PATTERNS = {
  al: {
    ios: {
      app_name: STRING_PATTERN,
      app_store_id: STRING_PATTERN,
      url: URI_SCHEME_PATTERN_REQUIRED
    },
    web: {
      should_fallback: /^(true|false|)$/,
      url: URL_PATTERN
    }
  }
};

export const validateFBAppLinkIOSMeta = meta =>
  validateMeta(meta, FB_APP_LINK_IOS_VALIDATE_PATTERNS);

const FB_APP_LINK_ANDROID_VALIDATE_PATTERNS = {
  al: {
    android: {
      app_name: STRING_PATTERN,
      package: STRING_PATTERN_REQUIRED,
      class: STRING_PATTERN,
      url: URI_SCHEME_PATTERN
    },
    web: {
      should_fallback: /^(true|false|)$/,
      url: URL_PATTERN
    }
  }
};

export const validateFBAppLinkAndroidMeta = meta =>
  validateMeta(meta, FB_APP_LINK_ANDROID_VALIDATE_PATTERNS);
