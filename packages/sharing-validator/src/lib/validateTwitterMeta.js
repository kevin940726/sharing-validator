import validateMeta from "./validateMeta";
import {
  STRING_PATTERN_REQUIRED,
  INTEGER_PATTERN_REQUIRED
} from "../utils/validationPatterns";

const TWITTER_HANDLE_PATTERN = /^@.+$|^$/;

// https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started
const TWITTER_VALIDATE_PATTERNS = {
  twitter: {
    card: (content, meta) => {
      if (typeof content === "undefined") {
        if (meta.og && meta.og.type && meta.og.title && meta.og.description) {
          return {
            valid: true,
            content: "summary"
          };
        }
      }

      return {
        valid: /^(summary|summary_large_image|app|player)$/.test(content),
        message: `Expected one of (summary, summary_large_image, app, player), received \`${content}\`.`
      };
    },
    site: TWITTER_HANDLE_PATTERN,
    creator: TWITTER_HANDLE_PATTERN
  }
};

function validateTwitterMeta(meta) {
  return validateMeta(meta, TWITTER_VALIDATE_PATTERNS);
}

export default validateTwitterMeta;
