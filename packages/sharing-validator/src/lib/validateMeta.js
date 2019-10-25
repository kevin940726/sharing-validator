function validateMeta(meta, patterns) {
  const results = [];

  function recursiveValidate(target, pattern, parentKeys = []) {
    if (!pattern) {
      return;
    }

    if (Array.isArray(target)) {
      target.forEach((item, index) => {
        recursiveValidate(item, pattern, [...parentKeys, `[${index}]`]);
      });
    } else if (
      !(pattern instanceof RegExp) &&
      typeof pattern === "object" &&
      !(
        Object.keys(pattern).length === 1 && Object.keys(pattern)[0] === pattern
      )
    ) {
      for (let key in pattern) {
        if (key !== "pattern") {
          recursiveValidate(target && target[key], pattern[key], [
            ...parentKeys,
            key
          ]);
        }
      }
    } else if (pattern instanceof RegExp) {
      const valid = pattern.test(target);

      if (!valid || typeof target !== "undefined") {
        results.push({
          key: parentKeys.join(":"),
          value: target,
          valid
        });
      }
    } else if (typeof pattern === "function") {
      const valid = pattern(target, meta);

      if (!valid || typeof target !== "undefined") {
        results.push({
          key: parentKeys.join(":"),
          value: target,
          valid
        });
      }
    } else {
      recursiveValidate(target, pattern.pattern, parentKeys);
    }
  }

  recursiveValidate(meta, patterns);

  return results;
}

export default validateMeta;
