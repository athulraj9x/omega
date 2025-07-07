import { useLocation } from "react-router-dom";

const usePageTitle = () => {
  const location = useLocation();
  const pageTitle = location.pathname.split("/").splice(1);
  const titles = {};
  const keys = ["parent", "title"];
  pageTitle?.map((title, index) => {
    let newTitle = title.split("-").join(" ");
    newTitle = capitalizeFirstLetters(newTitle);
    if (pageTitle?.length === 1) {
      const key = keys[index + 1];
      titles[key] = newTitle;
    } else {
      const key = keys[index];
      titles[key] = newTitle;
    }
    return newTitle;
  });
  return titles;
};

export default usePageTitle;

function capitalizeFirstLetters(str) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
}
