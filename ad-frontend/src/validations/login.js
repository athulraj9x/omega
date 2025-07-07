import validator from "validator";

function validateLogin(data) {
  const errors = {};

  if (validator.isEmpty(data.username.trim()))
    errors.username = "Please enter your username.";
  // else if (!validator(data.email))
  //   errors.username = "Please enter a valid username.";

  if (validator.isEmpty(data.password.trim()))
    errors.password = "Please enter your password.";
  return { errors, isValid: Object.keys(errors)?.length <= 0 };
}

export default validateLogin;
