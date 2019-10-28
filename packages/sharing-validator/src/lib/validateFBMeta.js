import validateMeta from "./validateMeta";
import {
  STRING_PATTERN_REQUIRED,
  INTEGER_PATTERN_REQUIRED
} from "../utils/validationPatterns";

// https://developers.facebook.com/docs/sharing/best-practices
const FB_VALIDATE_PATTERNS = {
  fb: {
    app_id: STRING_PATTERN_REQUIRED
  },
  og: {
    description: STRING_PATTERN_REQUIRED,
    image: {
      url: STRING_PATTERN_REQUIRED,
      width: content => ({
        valid: parseInt(content, 10) >= 600,
        message: `Expected "og:image:width" to be an integer >= 600, received ${content}`
      }),
      height: INTEGER_PATTERN_REQUIRED
    }
  }
};

function validateFBMeta(meta) {
  return validateMeta(meta, FB_VALIDATE_PATTERNS);
}

export default validateFBMeta;
