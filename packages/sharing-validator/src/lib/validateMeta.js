function validateMeta(meta, patterns) {
  const validations = [];
  const errors = [];

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
      const valid = pattern.test(target || "");
      const property = parentKeys.join(":");
      const message = `Expected to match ${pattern.toString()}, but received ${target}.`;

      validations.push({
        valid,
        property,
        content: target,
        message
      });

      if (!valid) {
        errors.push({
          valid,
          property,
          content: target,
          message
        });
      }
    } else if (typeof pattern === "function") {
      const { valid, message } = pattern(target, meta, parentKeys);
      const property = parentKeys.join(":");

      validations.push({
        valid: !!valid,
        property,
        content: target,
        message
      });

      if (!valid) {
        errors.push({
          valid: false,
          property,
          content: target,
          message
        });
      }
    } else {
      recursiveValidate(target, pattern.pattern, parentKeys);
    }
  }

  recursiveValidate(meta, patterns);

  return {
    validations,
    errors
  };
}

export default validateMeta;
