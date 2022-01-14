import type { Actions, Model } from "../store";

import { useStore } from "./useStore";

export const useActions = <S extends unknown, AS extends Actions<S>>(
  model: Model<S, AS>
) => {
  const store = useStore(model);
  return store.actions;
};
