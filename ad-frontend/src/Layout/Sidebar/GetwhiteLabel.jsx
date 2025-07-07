import { useSelector } from "react-redux";

export const useWhiteLabelData = () => {
  return useSelector((state) => state?.FetchWhiteLabelData?.data?.data?.whiteLabel);
};