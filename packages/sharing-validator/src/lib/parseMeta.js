function parseMetaData(meta) {
  const data = {};

  for (let [key, value] of meta) {
    if (!key || key === "undefined") {
      // Skip meta which doesn't have a `property` or `name` attribute
      continue;
    }

    const properties = key.split(":");

    let target = data;
    for (let property of properties.slice(0, -1)) {
      if (typeof target[property] === "string") {
        target[property] = {
          url: target[property]
        };
      } else if (
        Array.isArray(target[property]) &&
        target[property].some(item => typeof item === "string")
      ) {
        target[property] = target[property].map(item =>
          typeof item === "string"
            ? {
                url: item
              }
            : item
        );
      } else {
        target[property] = target[property] || {};
      }

      target = target[property];

      if (Array.isArray(target)) {
        target = target.slice(-1)[0];
      }
    }

    const lastKey = properties.slice(-1)[0];
    const originalValue = Array.isArray(target[lastKey])
      ? target[lastKey][0]
      : target[lastKey];
    const lastContent = Array.isArray(target[lastKey])
      ? target[lastKey].slice(-1)[0]
      : target[lastKey];

    if (originalValue) {
      if (typeof originalValue === "string") {
        target[lastKey] = [].concat(target[lastKey], value);
      } else {
        if (!lastContent.hasOwnProperty("url")) {
          lastContent.url = value;
        } else {
          target[lastKey] = [].concat(target[lastKey], { url: value });
        }
      }
    } else if (typeof target === "string") {
    } else {
      target[lastKey] = value;
    }
  }

  return data;
}

export default parseMetaData;
