import validator from "validator";

function validatePermission(data) {
  const errors = {};

  if (validator.isEmpty(data?.password?.toString()))
    errors.password = "Please enter the password.";
  return { errors, isValid: Object.keys(errors)?.length <= 0 };
}

export default validatePermission;
