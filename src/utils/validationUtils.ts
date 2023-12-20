export const validateStringParameter = (value: string): boolean => {
  const containsSpecialCharacters = (str: string): boolean => {
    const allowedSpecialCharacters = /[-_]/;
    return !allowedSpecialCharacters.test(str);
  };

  const validateParameter = (paramValue: string): boolean => {
    return (
      paramValue !== null &&
      paramValue !== undefined &&
      typeof paramValue === "string" &&
      paramValue.trim() !== "" &&
      !containsSpecialCharacters(paramValue)
    );
  };

  const isValidParameter = validateParameter(value);

  return isValidParameter;
};
