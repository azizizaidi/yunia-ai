import './App.css'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Yunia Dashboard</h1>
        </div>
      </header>
      <main className="container mx-auto py-6">
        <Dashboard />
      </main>
    </div>
  )
}

export default App
