import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import type { Todo } from '../type'

import style from '../todo.module.css'

const ENTER_CODE = 'enter'
const ESCAPE_CODE = 'esc'

interface TodoItemProps {
  key: string
  todo: Todo
  editing : string | null
  onSave: (todoId: string, title: string) => void
  onDestory: (todoId: string) => void
  onEdit: (todoId: string)  => void
  onCancel: (todoId: string) => void
  onToggle: (todoId: string) => void
}

export const TodoItem = ({
  todo,
  editing,
  onSave,
  onDestory,
  onEdit,
  onCancel,
  onToggle
}: TodoItemProps) => {
  const inputEl = useRef<HTMLInputElement>(null)
  const [editText, setEditText] = useState('')
  const isSelfEditing = useMemo(() => {
    return (
      editing !== null &&
      todo.id === editing
    )
  }, [todo, editing])
  
  useEffect(() => {
    if (isSelfEditing && inputEl.current) {
      inputEl.current.focus()
    }
  }, [isSelfEditing])

  const handleToggle = useCallback(() => {
    onToggle(todo.id)
  }, [onToggle, todo.id])

  const handleDelete = useCallback(() => {
    onDestory(todo.id)
  }, [onDestory, todo.id])

  const handleEdit = useCallback((): void => {
    setEditText(todo.content)
    onEdit(todo.id)
  }, [onEdit, todo.id, todo.content, setEditText])

  const handleSubmit = useCallback((): void => {
    const title = editText

    if (title) {
      onSave(todo.id, title)
      setEditText(title)
    } else {
      onDestory(todo.id)
    }
  }, [onSave, editText, todo.id, setEditText, onDestory])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setEditText(event.target.value)
  }, [setEditText])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.code === ESCAPE_CODE) {
      setEditText(todo.content)
      onCancel(todo.id)
    } else if (event.code === ENTER_CODE) {
      handleSubmit()
    }
  }, [setEditText, todo.content, todo.id, onCancel, handleSubmit])

  return (
    <li className={`${isSelfEditing ? style.editing : ''} ${todo.completed ? style.completed : ''}`}>
      <div className={style.view}>
        <input
          className={style.toggle}
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <label onDoubleClick={handleEdit}>
          {todo.content}
        </label>
        <button className={style.destroy} onClick={handleDelete} />
      </div>
      <input
        ref={inputEl}
        className={style.edit}
        value={editText}
        onBlur={handleSubmit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </li>
  )
}
