import React from 'react'
import {Router, Route, Switch} from 'react-router-dom'
import {history} from './history'
import requireAuthUser from './utils/requireAuthUser'
import UserLogin from './user/login/component'
import UserLogout from './user/logout/component'
import Users from './user/list/component'

const App = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/login" component={UserLogin} />
        <Route exact path="/" component={requireAuthUser(Users)} />
        <Route exact path="/logout" component={requireAuthUser(UserLogout)} />
      </Switch>
    </Router>
  )
}
export default App