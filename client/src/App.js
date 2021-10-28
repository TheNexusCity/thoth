import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import { useAuth } from './contexts/AuthProvider'
import { useTabManager } from './contexts/TabManagerProvider'
import GuardedRoute from './features/common/GuardedRoute/GuardedRoute'
import LoadingScreen from './features/common/LoadingScreen/LoadingScreen'
import ThothPageWrapper from './features/common/ThothPage/ThothPageWrapper'
import LoginScreen from './features/Login/LoginScreen'
import HomeScreen from './features/HomeScreen/HomeScreen'
import Thoth from './features/Thoth/Thoth'

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import './App.css'
//These need to be imported last to override styles.

function App() {
  // Use our routes
  const [checked, setChecked] = useState(false)
  const { tabs } = useTabManager()
  const { user, getUser, checkIn } = useAuth()
  const navigate = useNavigate()

  const authCheck = user && user.accessToken

  useEffect(() => {
    ;(async () => {
      const currentUser = await getUser()

      if (currentUser) {
        // checkin?
        checkIn(currentUser)
      }

      setChecked(true)
    })()
  }, [])

  const CreateNewScreen = () => {
    return <HomeScreen createNew={true} />
  }

  const AllProjectsScreen = () => {
    return <HomeScreen allProjects={true} />
  }

  const HomeScreen = () => {
    return <HomeScreen />
  }

  const redirect = () => {
    if (user && tabs.length > 0) {
      return <Navigate to="/thoth" />
    }

    return user ? <Navigate to="/home" /> : <Navigate to="/login" />
  }

  if (!checked) return <LoadingScreen />

  return (
    <ThothPageWrapper tabs={tabs}>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <GuardedRoute path="/thoth" element={<Thoth />} />
        <GuardedRoute path="/home" element={<HomeScreen />} />
        <GuardedRoute path="/home/create-new" element={<CreateNewScreen />} />
        <GuardedRoute
          path="/home/all-projects"
          element={<AllProjectsScreen />}
        />
        <Route path="/" element={redirect()} />
      </Routes>
    </ThothPageWrapper>
  )
}

export default App
