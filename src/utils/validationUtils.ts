export const validateStringParameter = (
  isRequired: boolean,
  value?: string
): boolean => {
  const validateParameters = (paramValue?: string) => {
    return (
      paramValue !== null &&
      paramValue !== undefined &&
      typeof paramValue === "string" &&
      paramValue.trim() !== ""
    );
  };

  let isValidParameter = true;

  if (isRequired) {
    isValidParameter = validateParameters(value);
  } else {
    if (value) {
      isValidParameter = validateParameters(value);
    }
  }

  return isValidParameter;
};
