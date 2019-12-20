import React from 'react'
import jwt_decode from 'jwt-decode'
import moment from 'moment'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { authConstant } from '../constant'

export default function (ComposedComponent) {
  class requireAuthUser extends React.Component {
    UNSAFE_componentWillMount() {
      const jwtToken = localStorage.getItem('jwtToken')
      const { dispatch } = this.props
      if (!jwtToken) this.redirectIfNotLogin()

      try {
        const data = jwt_decode(jwtToken)
        if (data.exp < moment().unix()) {
          localStorage.setItem('jwtToken', '')
          dispatch({
            type: authConstant.USER_LOGOUT_REQUEST,
          })
        } else {
          if (!this.props.auth.isAuthenticated) {
            dispatch({ type: authConstant.AUTO_USER_LOGIN_SUCCESS, user: data, token: jwtToken })
          }
        }
      } catch (e) {
        this.redirectIfNotLogin()
      }
    }

    redirectIfNotLogin() {
      localStorage.setItem('jwtToken', '')
      this.context.router.history.push('/login')
    }
    render() {
      const jwtToken = localStorage.getItem('jwtToken')
      if (jwtToken) {
        return (
          <ComposedComponent {...this.props} />
        )
      } else {
        return null
      }
    }
  }

  requireAuthUser.contextTypes = {
    router: PropTypes.object.isRequired
  }

  requireAuthUser.propTypes = {
    auth: PropTypes.object.isRequired
  }

  function mapStateToProps(state) {
    return {
      auth: state.authReducer
    }
  }

  return connect(mapStateToProps)(requireAuthUser)
}
