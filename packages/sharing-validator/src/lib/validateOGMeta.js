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
    determiner: content => ({
      valid: !content || /^(a|an|the|auto|)$/.test(content),
      message: `Expected determiner to be one of (a, an, the, "", auto), received ${content}`
    }),
    image: {
      pattern: URL_PATTERN,
      url: URL_PATTERN,
      secure_url: SECURE_URL_PATTERN,
      width: INTEGER_PATTERN,
      height: INTEGER_PATTERN,
      alt: (content, meta, key) => {
        const imageKey = key.slice(0, -1);

        let image = meta;

        try {
          for (let k of imageKey) {
            if (/[(\d+)]/.test(k)) {
              image = image[parseInt(k.slice(1, -1), 10)];
            } else {
              image = image[k];
            }
          }
        } catch (err) {
          // Not specified
          return {
            valid: true
          };
        }

        return {
          valid: !!(image.url && content),
          message:
            '"og:image.alt" is required when specifying "og:image" or "og:image:url"'
        };
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
