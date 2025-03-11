import Home from './pages/home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/signup'
import Login from './pages/login'
import Profile from './pages/profile'
import SignupCompletion from './pages/after_signup'
function App() {
  

  return (
    <>
     <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/after_signup" element={<SignupCompletion />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
