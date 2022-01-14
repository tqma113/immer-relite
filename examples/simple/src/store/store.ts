import {
  createStore,
  Action as ReliteAction,
  Store as ReliteStore,
  Currings,
} from "immer-relite";
import type { Todo } from "../type";
import { Showing } from "../constants";

type RichTodo = Todo & {
  localId?: string;
};

export type State = {
  todos: RichTodo[];
  currentShowing: Showing;
  editing: string | null;
};

export const defaultInitialState: State = {
  todos: [],
  currentShowing: Showing.ALL,
  editing: null,
};

export type Action<Payload = unknown> = ReliteAction<State, Payload>;

const addTodo: Action<{ id: string; content: string }> = (
  state,
  { content, id }
) => {
  state.todos.unshift({
    id,
    localId: id,
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

const updateTodos: Action<RichTodo[]> = (state, todos) => {
  state.todos = todos;
};

const updateId: Action<{ localId: string; id: string }> = (
  state,
  { localId, id }
) => {
  state.todos = state.todos.map((todo) => {
    if (todo.localId === localId) {
      return {
        ...todo,
        id,
      };
    }
    return todo;
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
  updateTodos,
  updateId,
} as const;

export type Store = ReliteStore<State, typeof actions>;

export type Actions = Currings<State, typeof actions>;

export const store = createStore(actions, defaultInitialState, "Todo");
