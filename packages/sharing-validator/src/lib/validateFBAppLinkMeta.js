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

export const validateFBAppLinkIOSMeta = meta =>
  validateMeta(meta, FB_APP_LINK_IOS_VALIDATE_PATTERNS);

const FB_APP_LINK_ANDROID_VALIDATE_PATTERNS = {
  al: {
    android: {
      app_name: STRING_PATTERN_REQUIRED,
      package: STRING_PATTERN_REQUIRED,
      url: URI_SCHEME_PATTERN
    }
  }
};

export const validateFBAppLinkAndroidMeta = meta =>
  validateMeta(meta, FB_APP_LINK_ANDROID_VALIDATE_PATTERNS);
