import React, { useState, useMemo, useCallback } from 'react'

import { todoModel } from '../store'
import { useSelector, useActions } from '../global'

import style from '../todo.module.css'

const ENTER_EVENT_KEY = 'Enter'

export const TodoHeader = () => {
  const [title, setTitle] = useState('')
  const actions = useActions(todoModel)
  const todos = useSelector(todoModel, (state) => state.todos)
  const todoCount = useMemo(() => todos.length, [todos])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === ENTER_EVENT_KEY && title !== '') {
      event.preventDefault()

      actions.addTodo(title)
      setTitle('')
    }
  }, [actions, title, todoCount])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value)
  }, [setTitle])

  return (
    <header className={style.header}>
      <h1>Todo List</h1>
      <input
        className={style["new-todo"]}
        value={title}
        placeholder="What needs to be done?"
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        autoFocus={true}
      />
    </header>
  )
}
