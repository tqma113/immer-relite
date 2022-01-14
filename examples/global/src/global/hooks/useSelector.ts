import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

import type { Actions } from "immer-relite";
import type { Selector, EqualityFn } from "immer-relite/react";
import { refEquality } from "immer-relite/react";
import { Model } from "../store";

import { useStore } from "./useStore";

export const useSelector = <
  S extends unknown,
  AS extends Actions<S>,
  Selected extends unknown
>(
  model: Model<S, AS>,
  selector: Selector<S, Selected>,
  equalityFn: EqualityFn<Selected> = refEquality
): Selected => {
  const store = useStore(model);

  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getState,
    // TODO Need a server-side snapshot here
    store.getState,
    selector,
    equalityFn
  );
};
