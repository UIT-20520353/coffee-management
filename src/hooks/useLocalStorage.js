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

  const setLocalStorage = useCallback(
    ({ key = commonConstants.LOCAL_STORAGE_KEY, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    []
  );

  return {
    getLocalStorage,
    setLocalStorage,
  };
};

export default useLocalStorage;
