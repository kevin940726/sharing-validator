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
      pattern: (content, meta) => meta.image || (meta.image && meta.image.url),
      width: content => parseInt(content, 10) >= 600,
      height: INTEGER_PATTERN_REQUIRED
    }
  }
};

function validateFBMeta(meta) {
  return validateMeta(meta, FB_VALIDATE_PATTERNS);
}

export default validateFBMeta;
