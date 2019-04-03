const isAllowMerge = (value: unknown) => {
  if (typeof value !== 'object') {
    return false;
  }

  return value !== null;
};

const emptyTarget = (value: unknown) => Array.isArray(value) ? [] : {};

const cloneUnlessOtherwiseSpecified = (value: unknown) => deepMerge(emptyTarget(value), value);

const arrayMerge = (target: Array<unknown>, source: Array<unknown>) => {
  return [...target, ...source].map((element) => cloneUnlessOtherwiseSpecified(element));
};

const objectMerge = (target: Record<string, unknown>, source: Record<string, unknown>) => {
  const destination = {};

  if (isAllowMerge(target)) {
    Object.entries(target).forEach(([key, value]) => {
      destination[key] = cloneUnlessOtherwiseSpecified(value);
    });
  }

  if (isAllowMerge(source)) {
    Object.entries(source).forEach(([key, value]) => {
      if (!isAllowMerge(value) || !target[key]) {
        destination[key] = cloneUnlessOtherwiseSpecified(value);
      } else {
        destination[key] = deepMerge(target[key], value);
      }
    });
  }

  return destination;
};

export const deepMerge = (target: unknown, source: unknown) => {
  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source);
  }
  if (sourceIsArray) {
    return arrayMerge(target as Array<unknown>, source as Array<unknown>);
  }
  return objectMerge(target as Record<string, unknown>, source as Record<string, unknown>);
};
