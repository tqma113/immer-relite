import React, { useMemo, useCallback } from "react";
import { todoModel } from "../store";
import { useSelector, useActions } from "../global";

import { Showing } from "../constants";

import style from "../todo.module.css";

export const TodoFooter = () => {
  const state = useSelector(todoModel, (state) => state);
  const actions = useActions(todoModel);

  const { count, completedCount } = useMemo(() => {
    const count = state.todos.filter((todo) => !todo.completed).length;
    const completedCount = state.todos.length - count;
    return { count, completedCount };
  }, [state.todos]);

  const handleClick = useCallback(() => {
    actions.removeCompletedTodos();
  }, [actions]);

  const handleTagClick = useCallback(
    (showing: Showing) => {
      actions.toggleShowing(showing);
    },
    [actions]
  );

  const handleAllClick = useCallback(
    () => handleTagClick(Showing.ALL),
    [handleTagClick]
  );
  const handleActiveClick = useCallback(
    () => handleTagClick(Showing.ACTIVE),
    [handleTagClick]
  );
  const handleCompletedClick = useCallback(
    () => handleTagClick(Showing.COMPLETED),
    [handleTagClick]
  );

  return (
    <footer className={style.footer}>
      <span className={style["todo-count"]}>
        <strong>{count}</strong> {count > 1 ? "items" : "item"} left
      </span>
      <ul className={style.filters}>
        <li>
          <a
            onClick={handleAllClick}
            className={`${
              state.currentShowing === Showing.ALL ? style.selected : ""
            }`}
          >
            All
          </a>
        </li>{" "}
        <li>
          <a
            onClick={handleActiveClick}
            className={`${
              state.currentShowing === Showing.ACTIVE ? style.selected : ""
            }`}
          >
            Active
          </a>
        </li>{" "}
        <li>
          <a
            onClick={handleCompletedClick}
            className={`${
              state.currentShowing === Showing.COMPLETED ? style.selected : ""
            }`}
          >
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className={style["clear-completed"]} onClick={handleClick}>
          Clear completed
        </button>
      )}
    </footer>
  );
};
