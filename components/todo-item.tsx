'use client'

import { createClient } from '@/lib/supabase'

interface Todo {
  id: string
  title: string
  completed: boolean
  created_at: string
}

interface TodoItemProps {
  todo: Todo
  onUpdate: () => void
}

export default function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const supabase = createClient()

  const toggleComplete = async () => {
    await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id)
    onUpdate()
  }

  const deleteTodo = async () => {
    await supabase
      .from('todos')
      .delete()
      .eq('id', todo.id)
    onUpdate()
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow mb-2 group">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleComplete}
        className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
      />
      <span
        className={`flex-1 ${
          todo.completed
            ? 'line-through text-gray-400 dark:text-gray-500'
            : 'text-gray-700 dark:text-gray-200'
        }`}
      >
        {todo.title}
      </span>
      <button
        onClick={deleteTodo}
        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity p-1"
        aria-label="Delete todo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}
