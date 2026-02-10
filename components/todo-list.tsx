'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import TodoItem from './todo-item'
import AddTodo from './add-todo'

interface Todo {
  id: string
  title: string
  completed: boolean
  status: 'todo' | 'in_progress' | 'completed'
  created_at: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

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

  const updateTodoStatus = async (todoId: string, newStatus: 'todo' | 'in_progress' | 'completed') => {
    const { error } = await supabase
      .from('todos')
      .update({ status: newStatus })
      .eq('id', todoId)

    if (!error) {
      fetchTodos()
    }
  }

  const handleDragStart = (e: React.DragEvent, todoId: string) => {
    e.dataTransfer.setData('todoId', todoId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, status: 'todo' | 'in_progress' | 'completed') => {
    e.preventDefault()
    const todoId = e.dataTransfer.getData('todoId')
    await updateTodoStatus(todoId, status)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className={`w-full mx-auto ${viewMode === 'kanban' ? 'max-w-7xl' : 'max-w-2xl'}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My To-Do List</h1>
          {userEmail && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              Kanban
            </button>
          </div>
          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>

      <AddTodo onAdd={fetchTodos} />

      {todos.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No todos yet!</p>
          <p className="text-sm">Add one above to get started.</p>
        </div>
      ) : viewMode === 'list' ? (
        <div>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
          ))}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
            {todos.filter((t) => t.completed).length} of {todos.length} completed
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* To Do Column */}
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-4 min-h-[400px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'todo')}
          >
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              To Do
              <span className="ml-auto text-sm font-normal text-gray-500">
                {todos.filter((t) => t.status === 'todo').length}
              </span>
            </h2>
            <div className="space-y-3">
              {todos
                .filter((t) => t.status === 'todo')
                .map((todo) => (
                  <div
                    key={todo.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, todo.id)}
                    className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg cursor-move hover:shadow-md transition-shadow border-l-4 border-gray-400"
                  >
                    <p className="text-gray-800 dark:text-gray-100 font-medium">{todo.title}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-4 min-h-[400px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'in_progress')}
          >
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              In Progress
              <span className="ml-auto text-sm font-normal text-gray-500">
                {todos.filter((t) => t.status === 'in_progress').length}
              </span>
            </h2>
            <div className="space-y-3">
              {todos
                .filter((t) => t.status === 'in_progress')
                .map((todo) => (
                  <div
                    key={todo.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, todo.id)}
                    className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg cursor-move hover:shadow-md transition-shadow border-l-4 border-blue-500"
                  >
                    <p className="text-gray-800 dark:text-gray-100 font-medium">{todo.title}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Completed Column */}
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-4 min-h-[400px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'completed')}
          >
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Completed
              <span className="ml-auto text-sm font-normal text-gray-500">
                {todos.filter((t) => t.status === 'completed').length}
              </span>
            </h2>
            <div className="space-y-3">
              {todos
                .filter((t) => t.status === 'completed')
                .map((todo) => (
                  <div
                    key={todo.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, todo.id)}
                    className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg cursor-move hover:shadow-md transition-shadow border-l-4 border-green-500"
                  >
                    <p className="text-gray-800 dark:text-gray-100 font-medium line-through opacity-75">
                      {todo.title}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
