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
    url: (content, meta, parentKeys, configs) => {
      if (!content) {
        return {
          valid: false,
          type: "warning",
          content: configs.url,
          message:
            '"og:url" is not set, fallback to the requested url as default value instead'
        };
      }

      return URL_PATTERN(content, meta, parentKeys, configs);
    },
    title: (content, meta) => {
      if (!content && meta.title) {
        return {
          valid: false,
          type: "warning",
          content: meta.title,
          message:
            '"og:title" is not set, fallback to the <title> value instead.'
        };
      }

      return {
        valid: !!content,
        message: `Either "og:title" property or <title> value is required.`
      };
    },
    // https://ogp.me/#types
    type: content => {
      if (!content) {
        return {
          valid: false,
          type: "warning",
          content: "website",
          message:
            '"og:type" is not set, fallback to `"website"` as default value.'
        };
      }

      return {
        valid: /^(music\.(song|album|playlist|radio_station)|video\.(movie|episode|tv_show|other)|article|book|profile|website)$/.test(
          content
        ),
        message: `"og:type" should be one of the below, instead received \`${JSON.stringify(
          content
        )}\`.
(music.song, music.album, music.playlist, music.radio_station, video.movie, video.episode, video.tv_show, video.other, article, book, profile, website)`
      };
    },

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
      message: `Expected determiner to be one of (a, an, the, "", auto), received \`${JSON.stringify(
        content
      )}\``
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

        if (!image) {
          // Not specified image at all
          return {
            valid: true
          };
        }

        return {
          type: "warning",
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

function validateOGMeta(meta, configs) {
  return validateMeta(meta, VALIDATE_PATTERNS, configs);
}

export default validateOGMeta;
