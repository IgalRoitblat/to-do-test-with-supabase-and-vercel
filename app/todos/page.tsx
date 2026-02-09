import TodoList from '@/components/todo-list'

export const dynamic = 'force-dynamic'

export default function TodosPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <TodoList />
    </div>
  )
}
