import validateMeta from "./validateMeta";
import {
  STRING_PATTERN,
  STRING_PATTERN_REQUIRED,
  URL_PATTERN,
  SECURE_URL_PATTERN,
  INTEGER_PATTERN,
  LOCALE_PATTERN
} from "../utils/validationPatterns";

const VALIDATE_PATTERNS = {
  // https://ogp.me/#metadata
  og: {
    // required
    url: STRING_PATTERN_REQUIRED,
    title: STRING_PATTERN_REQUIRED,
    // https://ogp.me/#types
    type: /^(music\.(song|album|playlist|radio_station)|video\.(movie|episode|tv_show|other)|article|book|profile|website)$/,

    // optional types
    locale: {
      pattern: LOCALE_PATTERN,
      alternate: {
        pattern: LOCALE_PATTERN
      }
    },
    description: STRING_PATTERN,
    site_name: STRING_PATTERN,
    determiner: content => !content || /^(a|an|the|auto|)$/.test(content),
    image: {
      pattern: URL_PATTERN,
      url: URL_PATTERN,
      secure_url: SECURE_URL_PATTERN,
      width: INTEGER_PATTERN,
      height: INTEGER_PATTERN,
      alt: (content, meta) => {
        if (meta.og && meta.og.image) {
          if (
            typeof meta.og.image === "string" ||
            typeof meta.og.image.url === "string"
          ) {
            return STRING_PATTERN_REQUIRED.test(content);
          }
        }
        return STRING_PATTERN(content);
      }
    },
    video: {
      pattern: URL_PATTERN,
      url: URL_PATTERN,
      secure_url: SECURE_URL_PATTERN,
      width: INTEGER_PATTERN,
      height: INTEGER_PATTERN
    },
    audio: {
      pattern: URL_PATTERN,
      url: URL_PATTERN,
      secure_url: SECURE_URL_PATTERN
    }
  }
};

function validateOGMeta(meta) {
  return validateMeta(meta, VALIDATE_PATTERNS);
}

export default validateOGMeta;
