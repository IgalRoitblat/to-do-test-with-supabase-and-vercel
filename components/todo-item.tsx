'use client'

import { createClient } from '@/lib/supabase'

interface Todo {
  id: string
  title: string
  completed: boolean
  status: 'todo' | 'in_progress' | 'completed'
  created_at: string
}

interface TodoItemProps {
  todo: Todo
  onUpdate: () => void
}

export default function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const supabase = createClient()

  const updateStatus = async (newStatus: 'todo' | 'in_progress' | 'completed') => {
    await supabase
      .from('todos')
      .update({
        status: newStatus,
        completed: newStatus === 'completed'
      })
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

  const getStatusColor = () => {
    switch (todo.status) {
      case 'todo':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300'
    }
  }

  const getStatusLabel = () => {
    switch (todo.status) {
      case 'todo':
        return 'To Do'
      case 'in_progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow mb-2 group">
      <span
        className={`flex-1 ${
          todo.status === 'completed'
            ? 'line-through text-gray-400 dark:text-gray-500'
            : 'text-gray-700 dark:text-gray-200'
        }`}
      >
        {todo.title}
      </span>

      <div className="flex items-center gap-2">
        <select
          value={todo.status}
          onChange={(e) => updateStatus(e.target.value as 'todo' | 'in_progress' | 'completed')}
          className={`text-xs px-2 py-1 rounded border ${getStatusColor()} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

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
    </div>
  )
}
