export const STRING_PATTERN_REQUIRED = /.+/;
export const STRING_PATTERN = content => ({
  valid: !content || STRING_PATTERN_REQUIRED.test(content),
  message: `Expected string, received ${content}.`
});

export const INTEGER_PATTERN_REQUIRED = content => ({
  valid: Number.isInteger(+content),
  message: `Required to be integer, received ${content}.`
});
export const INTEGER_PATTERN = content => ({
  valid: !content || INTEGER_PATTERN_REQUIRED(content),
  message: `Expected integer, received ${content}`
});

export const URL_PATTERN = content => {
  try {
    let url = content;
    if (url.startsWith("//")) {
      url = "https:" + url;
    }

    const urlData = new URL(url);

    return {
      valid: urlData.protocol === "http:" || urlData.protocol === "https:",
      content: url,
      message: `Expected url to have 'http' or 'https' protocol, received ${urlData.protocol}`
    };
  } catch (err) {
    return {
      valid: !content,
      message: `Failed to parse the url. ${err.message}`
    };
  }
};
export const SECURE_URL_PATTERN = content => {
  try {
    const urlData = new URL(content);

    return {
      valid: urlData.protocol === "http:" || urlData.protocol === "https:",
      message: `Expected url to have 'https' protocol only, received ${urlData.protocol}`
    };
  } catch (err) {
    return {
      valid: !content,
      message: `Failed to parse the url. ${err.message}`
    };
  }
};

export const LOCALE_PATTERN = content => ({
  valid: !content || /^[a-z]+_[A-Z]+$|/.test(content),
  message: `Expected locale to match the ISO standard, received ${content}.`
});
