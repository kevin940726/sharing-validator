import validateMeta from "./validateMeta";
import {
  STRING_PATTERN_REQUIRED,
  INTEGER_PATTERN_REQUIRED
} from "../utils/validationPatterns";

const TWITTER_HANDLE_PATTERN = /^@.+$|^$/;

// https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started
const TWITTER_VALIDATE_PATTERNS = {
  twitter: {
    card: /^(summary|summary_large_image|app|player)$/,
    site: TWITTER_HANDLE_PATTERN,
    creator: TWITTER_HANDLE_PATTERN
  }
};

function validateTwitterMeta(meta) {
  return validateMeta(meta, TWITTER_VALIDATE_PATTERNS);
}

export default validateTwitterMeta;
