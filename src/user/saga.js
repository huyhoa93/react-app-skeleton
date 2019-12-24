import { takeLatest, call, put } from 'redux-saga/effects'
import jwt_decode from 'jwt-decode'
import querystring from 'querystring'

import { authConstant, linkAPI, requestMethod } from '../constant'
import { history } from '../history'
import { httpClient } from '../utils/httpClient'
import setAuthorizationToken from '../utils/setAuthorizationToken'

async function callLoginUser(data) {
  const linkLogin = `${linkAPI.LINK}/api/login`
  let responseObject = {}

  await httpClient(linkLogin, requestMethod.POST, {
    formData: querystring.stringify(data),
    callBack: function (response) {
      const token = response.data.response.jwt_token
      localStorage.setItem('jwtToken', token)
      setAuthorizationToken(token)
      const userData = jwt_decode(token)
      responseObject = {
        success: true,
        userData: userData
      }
    },
    catchError: function (error) {
      responseObject = {
        success: false,
        error: error.response.data.response
      }
    },
    runDefaultError: {
      error401: false
    }
  })

  return responseObject
}

async function callGetUserData(userId) {
  const linkGetUser = `${linkAPI.LINK}/api/users/${userId}`

  let responseObject = {}
  await httpClient(linkGetUser, requestMethod.GET, {
    callBack: function (response) {
      responseObject = {
        success: true,
        userData: response.data.response.user
      }
    },
    catchError: function(error) {
      responseObject = {
        success: false,
        error: error.response.data.response
      }
    }
  })
  return responseObject
}

function* userLoginRequestFlow(action) {
  const { data } = action
  try {
    const response = yield call(callLoginUser, data)
    if (response.success) {
      yield put({ type: authConstant.USER_LOGIN_SUCCESS, user: response.userData })
      history.push('/')
    } else {
      yield put({ type: authConstant.USER_LOGIN_FAIL, error: response.error })
    }
  } catch (error) {
    // yield put({ type: authConstant.LOGIN_FAILURE })
  }
}

function* userLogoutFlow() {
  localStorage.removeItem('jwtToken')
  setAuthorizationToken(null)
  yield put({ type: authConstant.USER_LOGOUT_SUCCESS })
  history.push('/login')
}

function* userAutoLoginFlow (action) {
  setAuthorizationToken(action.token)
  const userData = jwt_decode(action.token)
  yield put({ type: authConstant.USER_LOGIN_SUCCESS, user: userData })
  try {
    const response = yield call(callGetUserData, action.user.id)
    if (response.success) {
      yield put({ type: authConstant.USER_LOGIN_SUCCESS, user: response.userData })
    } else {
      yield put({ type: authConstant.USER_LOGIN_FAIL, error: response.error })
    }
  } catch (error) {
    // error
  }
}

export function* UserRegisterLoginWatcher() {
  yield takeLatest(authConstant.USER_LOGIN_REQUEST, userLoginRequestFlow)
  yield takeLatest(authConstant.AUTO_USER_LOGIN_SUCCESS, userAutoLoginFlow)
  yield takeLatest(authConstant.USER_LOGOUT_REQUEST, userLogoutFlow)
}
