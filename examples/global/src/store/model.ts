import type { Todo } from "../type";

import {
  createModel,
  Action as ReliteAction,
  Store as ReliteStore,
  Currings,
} from "../global";
import { Showing } from "../constants";

export type State = {
  todos: Todo[];
  currentShowing: Showing;
  editing: string | null;
};

export const defaultInitialState: State = {
  todos: [],
  currentShowing: Showing.ALL,
  editing: null,
};

function uuid() {
  let i: number, random: number;
  let uuid = "";

  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += "-";
    }
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }

  return uuid;
}

export type Action<Payload = unknown> = ReliteAction<State, Payload>;

const addTodo: Action<string> = (state, content) => {
  state.todos.unshift({
    id: uuid(),
    content,
    completed: false,
  });
};

const removeTodo: Action<string> = (state, todoId) => {
  state.todos = state.todos.filter((todo) => todo.id !== todoId);
};

const removeCompletedTodos: Action = (state) => {
  state.todos = state.todos.filter((todo) => !todo.completed);
};

const toggleAll: Action<boolean> = (state, completed) => {
  state.todos = state.todos.map((todo) => {
    return {
      ...todo,
      completed,
    };
  });
};

const toggleOne: Action<string> = (state, todoId) => {
  state.todos = state.todos.map((todo) => {
    if (todo.id !== todoId) return todo;

    return {
      ...todo,
      completed: !todo.completed,
    };
  });
};

const toggleShowing: Action<Showing> = (state, currentShowing) => {
  state.currentShowing = currentShowing;
  return state;
};

const startEditing: Action<string> = (state, editing) => {
  state.editing = editing;
};

const stopEditing: Action = (state) => {
  state.editing = null;
};

const updateEditingTitle: Action<string> = (state, content) => {
  state.todos = state.todos.map((todo) => {
    if (todo.id !== state.editing) return todo;

    return {
      ...todo,
      content,
    };
  });
};

const actions = {
  addTodo,
  removeTodo,
  removeCompletedTodos,
  toggleAll,
  toggleOne,
  toggleShowing,
  startEditing,
  stopEditing,
  updateEditingTitle,
} as const;

export type Store = ReliteStore<State, typeof actions>;

export type Actions = Currings<State, typeof actions>;

export const todoModel = createModel(actions, defaultInitialState, "Todo_2");
