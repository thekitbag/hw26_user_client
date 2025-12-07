import { Outlet } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Harkwise</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Powered by Harkwise
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
