'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface AddTodoProps {
  onAdd: () => void
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { error } = await supabase
        .from('todos')
        .insert({ title: title.trim(), user_id: user.id, status: 'todo' })

      if (!error) {
        setTitle('')
        onAdd()
      }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Adding...' : 'Add'}
      </button>
    </form>
  )
}
