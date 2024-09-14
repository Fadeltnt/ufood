import './App.css'
import { Route, Routes } from 'react-router-dom'
import TestRoute from './routes/TestRoute/TestRoute'
import { HomePage } from './routes/HomePage/HomePage'
import RestoPage from './routes/RestoPage/RestoPage'
import UserPage from './routes/UserPage/UserPage'
import LoginPage from './routes/LoginPage/LoginPage'
import RegisterPage from './routes/RegisterPage/RegisterPage.jsx'
import VisitModal from './components/VisitModal/VisitModal'
import { VisitModalDetails } from './routes/VisitModalDetails/VisitModalDetails.jsx'
import FriendPage from './routes/UserPage/FriendPage.jsx'


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/restaurant/:id' element={<RestoPage />} />
        <Route path='/user' element={<UserPage />} />
        <Route path='/user/:id' element={<FriendPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/VisitModalDetails/:idRestaurant/:name'
          element={<VisitModalDetails />}
        />
        <Route
          path='/register'
          element={
            <div style={{ width: '100dvw', height: '100dvh' }}>
              <RegisterPage />
            </div>
          }
        />

        <Route path='/modal' element={<VisitModal />} />
        <Route path='*' element={<div>404 not found</div>} />
      </Routes>
    </div>
  )
}

export default App
