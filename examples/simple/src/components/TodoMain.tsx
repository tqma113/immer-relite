import React, { useMemo, useCallback } from "react";
import { Showing } from "../constants";
import { useSelector, useActions } from '../store'

import { TodoItem } from './TodoItem'

import style from '../todo.module.css'

export const TodoMain = () => {
  const actions = useActions();

  const state = useSelector((state) => state)

  const hasActiveTodo = useMemo(
    () =>
      state.todos.some((todo) => {
        return todo.completed === false;
      }),
    [state.todos]
  );

  const toggleAll = useCallback(() => {
    const completed = !state.todos.every((todo) => {
      return todo.completed
    })
    actions.toggleAll(completed)
  }, [actions, state.todos]);

  const onSave = useCallback((todoId: string, title: string) => {
    if (state.editing === todoId) {
      actions.updateEditingTitle(title)
      actions.stopEditing()
    }
  }, [actions, state.editing])

  const onDestory = useCallback((todoId: string) => {
    actions.removeTodo(todoId)
    actions.stopEditing()
  }, [actions])

  const onEdit = useCallback((todoId: string) => {
    if (state.editing === null) {
      actions.startEditing(todoId)
    }
  }, [actions, state.editing])

  const onChange = useCallback((todoId: string) => {
    if (state.editing === todoId) {
      actions.stopEditing()
    }
  }, [actions, state.editing])

  const onToggle = useCallback((todoId: string) => {
    actions.toggleOne(todoId)
  }, [actions])

  const items = useMemo(() => {
    let tl = state.todos.slice();

    if (state.currentShowing === Showing.ACTIVE) {
      tl = tl.filter((todo) => {
        return !todo.completed;
      });
    }

    if (state.currentShowing === Showing.COMPLETED) {
      tl = tl.filter((todo) => {
        return todo.completed;
      });
    }

    return tl.map((todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          editing={state.editing}
          onSave={onSave}
          onDestory={onDestory}
          onEdit={onEdit}
          onCancel={onChange}
          onToggle={onToggle}
        />
      );
    });
  }, [state.todos, state.currentShowing, state.editing, onSave, onDestory, onEdit, onChange, onToggle]);

  return (
    <section className={style.main}>
      <input
        id="toggle-all"
        className={style["toggle-all"]}
        type="checkbox"
        onChange={toggleAll}
        checked={hasActiveTodo}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className={style["todo-list"]}>{items}</ul>
    </section>
  );
};
