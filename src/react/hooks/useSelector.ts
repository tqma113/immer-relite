import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

import { useStore } from "./useStore";

export type Selector<I, R> = (input: I) => R;
export type EqualityFn<T> = (a: T | undefined, b: T | undefined) => boolean;

export const refEquality: EqualityFn<any> = (a, b) => a === b;

export const useSelector = <State, Selected>(
  selector: Selector<State, Selected>,
  equalityFn: EqualityFn<Selected> = refEquality
): Selected => {
  const store = useStore();

  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getState,
    // TODO Need a server-side snapshot here
    store.getState,
    selector,
    equalityFn
  );
};
