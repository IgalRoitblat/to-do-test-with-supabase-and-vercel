'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import TodoItem from './todo-item'
import AddTodo from './add-todo'

interface Todo {
  id: string
  title: string
  completed: boolean
  created_at: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const supabase = createClient()

  const fetchTodos = useCallback(async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setTodos(data)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email ?? null)
      }
    }
    getUser()
    fetchTodos()
  }, [supabase, fetchTodos])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My To-Do List</h1>
          {userEmail && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
        >
          Sign Out
        </button>
      </div>

      <AddTodo onAdd={fetchTodos} />

      {todos.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No todos yet!</p>
          <p className="text-sm">Add one above to get started.</p>
        </div>
      ) : (
        <div>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
          ))}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
            {todos.filter((t) => t.completed).length} of {todos.length} completed
          </p>
        </div>
      )}
    </div>
  )
}
