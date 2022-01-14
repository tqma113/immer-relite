import React, { useState, useMemo, useCallback } from 'react'

import { useSelector, useActions } from '../store'

import style from '../todo.module.css'

const ENTER_EVENT_KEY = 'Enter'

export const TodoHeader = () => {
  const [title, setTitle] = useState('')
  const actions = useActions()
  const todos = useSelector((state) => state.todos)
  const todoCount = useMemo(() => todos.length, [todos])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === ENTER_EVENT_KEY && title !== '') {
      event.preventDefault()

      const id = uuid()
      actions.addTodo({content: title, id })
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

function uuid() {
  let i: number, random: number
  let uuid = '';

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
      .toString(16);
  }

  return uuid;
}