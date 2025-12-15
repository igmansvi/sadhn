import { useState } from 'react'
import LoginSignup from '../components/register/LoginSignup'
import ForgotPassword from '../components/register/ForgotPassword'

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  return (
    <>
      {currentPage === 'login' ? (
        <LoginSignup onForgotPassword={() => setCurrentPage('forgot-password')} />
      ) : (
        <ForgotPassword onBack={() => setCurrentPage('login')} />
      )}
    </>
  )
}

export default App