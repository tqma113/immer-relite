import type { Todo } from "../type";
import {
  useStore as useStoreBasic,
  useSelector as useSelectorBasic,
  Selector,
  EqualityFn,
} from "immer-relite/react";
import type { State, Store } from "./store";

export type PageProps = {
  todos: Todo[];
};

export const useStore = (): Store => {
  return useStoreBasic() as Store;
};

export const useSelector = <Selected>(
  selector: Selector<State, Selected>,
  equalityFn?: EqualityFn<Selected>
): Selected => {
  return useSelectorBasic<State, Selected>(selector, equalityFn);
};

export const useStoreState = () => {
  return useSelector((state) => state);
};

export const useTodos = () => {
  return useSelector((state) => state.todos);
};

export const useActions = () => {
  return useStore().actions;
};
