import _ from 'lodash'
import { authConstant } from './constant'

const initState = {
  isAuthenticated: false,
  user: {},
  error: false,
  message: '',
  isLoading: false
}

export function authReducer(state = initState, action) {
  switch (action.type) {
    case authConstant.USER_LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: !_.isEmpty(action.user),
        user: action.user,
        error: false,
        message: '',
        isLoading: false,
      }
    case authConstant.USER_LOGIN_FAIL:
      return {
        ...state,
        error: true,
        message: action.error.message
      }
    case authConstant.USER_LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
        error: false,
        message: '',
        isLoading: false
      }
    default:
      return state
  }
}
