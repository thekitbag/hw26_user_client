import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import FeedbackPage from '@/pages/FeedbackPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path=":locationId" element={<FeedbackPage />} />
      </Route>
    </Routes>
  )
}

export default App
