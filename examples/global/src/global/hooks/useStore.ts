import type { Actions, Model, Store } from "../store";

import { useStorage } from "./useStorage";

export const useStore = <S extends unknown, AS extends Actions<S>>(
  model: Model<S, AS>
): Store<S, AS> => {
  const storage = useStorage();
  return storage.getStore(model);
};
