import PropTypes from "prop-types";

export const url = process.env.REACT_APP_API_ENDPOINT;

export const getLocalStorageItem = (key) => localStorage.getItem(key);

export const setLocalStorageItem = (key, value) =>
  localStorage.setItem(key, value);

export const removeLocalStorageItem = (key) => localStorage.removeItem(key);

export const getDefaultState = (keyName) => {
  const storedValue = localStorage.getItem(keyName);

  if (storedValue !== null && storedValue !== undefined) {
    try {
      const value = JSON.parse(storedValue);

      return value;
    } catch (error) {
      console.error("Error parsing localStorage value:", error);
    }
  } else {
    return null;
  }
};

export const ErrorToast = ({ msg }) => (
  <div>
    <svg
      width="1.0625em"
      height="1em"
      viewBox="0 0 17 16"
      className="bi bi-exclamation-triangle mb-1 mr-1"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M7.938 2.016a.146.146 0 0 0-.054.057L1.027 13.74a.176.176 0 0 0-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017h13.713a.12.12 0 0 0 .066-.017.163.163 0 0 0 .055-.06.176.176 0 0 0-.003-.183L8.12 2.073a.146.146 0 0 0-.054-.057A.13.13 0 0 0 8.002 2a.13.13 0 0 0-.064.016zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"
      />
      <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
    </svg>
    &nbsp;&nbsp;
    {msg}
  </div>
);
ErrorToast.propTypes = {
  msg: PropTypes.string,
};

export const SuccessToast = ({ msg }) => (
  <div>
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      className="bi bi-check-circle mb-1 mr-1"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
      />
      <path
        fillRule="evenodd"
        d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"
      />
    </svg>
    &nbsp;&nbsp;
    {msg}
  </div>
);
SuccessToast.propTypes = {
  msg: PropTypes.string,
};

export const WarningToast = ({ msg }) => (
  <div>
    <svg
      width="1.0625em"
      height="1em"
      viewBox="0 0 17 16"
      className="bi bi-exclamation-triangle mb-1 mr-1"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M7.938 2.016a.146.146 0 0 0-.054.057L1.027 13.74a.176.176 0 0 0-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017h13.713a.12.12 0 0 0 .066-.017.163.163 0 0 0 .055-.06.176.176 0 0 0-.003-.183L8.12 2.073a.146.146 0 0 0-.054-.057A.13.13 0 0 0 8.002 2a.13.13 0 0 0-.064.016zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"
      />
      <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
    </svg>
    &nbsp;&nbsp;
    {msg}
  </div>
);
WarningToast.propTypes = {
  msg: PropTypes.string,
};


export const convertToCamelCase = (text) => {
  const words = text.split("-");
  const convertedText = words.join("");

  return convertedText;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Format day
  const day = date.getDate();
  const formattedDay = day < 10 ? `0${day}` : day;

  // Format month
  const month = date?.toLocaleString("default", { month: "long" });

  // Format time
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? `0${minutes}` : minutes
    }${hours < 12 ? "AM" : "PM"}`;

  // Construct the formatted date string
  const formattedDate = `${formattedDay} ${month} ${formattedTime}`;

  return formattedDate;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const convertINRToCurrency = (amountINR, conversionRate, number) => {
  if (amountINR !== undefined) {
    //***pass true in number if we want response in number format
    let rate = parseFloat(conversionRate);
    if (
      conversionRate === undefined ||
      conversionRate === null ||
      conversionRate === 0 ||
      isNaN(conversionRate)
    ) {
      rate = 1;
    }
    const amountConverted = amountINR * rate;
    if (number) {
      //returns number
      return parseFloat(amountConverted).toFixed(2);
    } else {
      return amountConverted.toLocaleString("en-us", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }
};

export const convertToINR = (amount, conversionRate) => {
  if (amount !== undefined) {
    let rate = conversionRate;
    if (
      conversionRate === undefined ||
      conversionRate === null ||
      conversionRate === 0 ||
      isNaN(conversionRate)
    ) {
      rate = 1;
    }
    const amountConverted = amount / rate;
    return parseFloat(amountConverted).toFixed(2);
  }
};

export const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}