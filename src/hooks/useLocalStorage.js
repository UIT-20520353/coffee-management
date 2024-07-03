import { useCallback } from "react";
import commonConstants from "@/app/constant";

const useLocalStorage = () => {
  const getLocalStorage = useCallback(
    (key = commonConstants.LOCAL_STORAGE_KEY) => {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : undefined;
    },
    []
  );

  return {
    getLocalStorage,
  };
};

export default useLocalStorage;
