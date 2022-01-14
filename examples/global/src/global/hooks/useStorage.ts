import { useContext } from "react";

import { StorageContext } from "../components";

export const useStorage = () => {
  const storage = useContext(StorageContext);

  if (!storage) {
    throw new Error(
      "Can not use `useStorage` outside `StorageContext.Provider`"
    );
  }

  return storage;
};
