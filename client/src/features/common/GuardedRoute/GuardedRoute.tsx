import { Route, Redirect } from 'react-router-dom'

import { useAuth } from '../../../contexts/AuthProvider'

const GuardedRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth()

  const auth = user && user.accessToken
  return (
    <Route
      {...rest}
      component={props =>
        auth ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  )
}

export default GuardedRoute
