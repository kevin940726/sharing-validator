export const STRING_PATTERN_REQUIRED = /.+/;
export const STRING_PATTERN = content =>
  !content || STRING_PATTERN_REQUIRED.test(content);

export const INTEGER_PATTERN_REQUIRED = content => Number.isInteger(+content);
export const INTEGER_PATTERN = content =>
  !content || INTEGER_PATTERN_REQUIRED(content);

export const URL_PATTERN = content => {
  try {
    const urlData = new URL(content);

    return urlData.protocol === "http:" || urlData.protocol === "https:";
  } catch (err) {
    return !content;
  }
};
export const SECURE_URL_PATTERN = content => {
  try {
    const urlData = new URL(content);

    return urlData.protocol === "https:";
  } catch (err) {
    return !content;
  }
};

export const LOCALE_PATTERN = content =>
  !content || /^[a-z]+_[A-Z]+$|/.test(content);
