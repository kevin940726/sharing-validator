import validateMeta from "./validateMeta";
import {
  STRING_PATTERN_REQUIRED,
  URL_PATTERN
} from "../utils/validationPatterns";

// https://developers.facebook.com/docs/sharing/best-practices
const FB_VALIDATE_PATTERNS = {
  fb: {
    app_id: content => ({
      valid: !!content,
      type: "warning",
      message:
        "In order to use Facebook Insights you must add the app ID to your page."
    })
  },
  og: {
    description: (content, meta) => {
      if (!content && meta.description) {
        return {
          valid: false,
          type: "warning",
          content: meta.description,
          message:
            '"og:description" is not set, fallback to "description" meta value instead.'
        };
      }

      return {
        valid: !!content,
        message: `Either property of "og:description" or "description" is required.`
      };
    },
    image: {
      pattern: (content, meta, key) => {
        let imageURL;
        let imageKey;

        if (typeof meta.image === "string") {
          imageURL = meta.image;
          imageKey = "og:image";
        } else if (typeof meta.image === "object") {
          imageURL = meta.image.url;
          imageKey = "og:image:url";
        } else if (Array.isArray(meta.image)) {
          imageURL = meta.image[0].url;
          imageKey = "og:image:url";
        }

        if (!imageURL) {
          return {
            type: "warning",
            valid: false,
            message: `Either property of "og:image" or "og:image:url" is required.`
          };
        }

        return URL_PATTERN(imageURL);
      }
    }
  }
};

function validateFBMeta(meta) {
  return validateMeta(meta, FB_VALIDATE_PATTERNS);
}

export default validateFBMeta;
