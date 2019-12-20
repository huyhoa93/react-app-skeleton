import axios from 'axios'
import { authConstant, requestStatus } from '../constant'
import { history } from '../history'
import store from '../store'

const initRunDefaultError = {
  error400: true,
  error401: true,
  error403: true,
  error404: true,
  error500: true,
}

export async function httpClient(linkApi, method, objectConfig) {
  const callBack = objectConfig.callBack !== undefined ? objectConfig.callBack : function() {}
  const catchError = objectConfig.catchError !== undefined ? objectConfig.catchError : function() {}
  const params = objectConfig.params !== undefined ? objectConfig.params : {}
  const formData = objectConfig.formData !== undefined ? objectConfig.formData : {}
  const contentType = objectConfig.contentType !== undefined ? objectConfig.contentType : 'application/x-www-form-urlencoded'
  const runDefaultError = objectConfig.runDefaultError !== undefined ? objectConfig.runDefaultError : initRunDefaultError
  const headers = {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    Pragma: 'no-cache'
  }

  switch (method) {
    case 'PATCH':
      await axios.patch(linkApi, formData)
        .then(function(response) {
          callbackAfterCallAPI(response, callBack, runDefaultError)
        }).catch(function(error) {
          callbackAfterCallAPI(error, catchError, runDefaultError)
        })
      break
    case 'PUT':
      await axios.put(linkApi, formData)
        .then(function(response) {
          callbackAfterCallAPI(response, callBack, runDefaultError)
        }).catch(function(error) {
          callbackAfterCallAPI(error, catchError, runDefaultError)
        })
      break
    case 'DELETE':
      await axios.delete(linkApi).then(function(response) {
        callbackAfterCallAPI(response, callBack, runDefaultError)
      }).catch(function(error) {
        callbackAfterCallAPI(error, catchError, runDefaultError)
      })
      break
    case 'POST':
      await axios.post(linkApi, formData, {
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
        }
      }).then(function(response) {
        callbackAfterCallAPI(response, callBack, runDefaultError)
      }).catch(function(error) {
        callbackAfterCallAPI(error, catchError, runDefaultError)
      })
      break
    case 'GET':
    default:
      await axios.get(linkApi, {
        headers,
        params
      }).then(function(response) {
        callbackAfterCallAPI(response, callBack, runDefaultError)
      }).catch(function(error) {
        callbackAfterCallAPI(error, catchError, runDefaultError)
      })
      break
  }
}

async function callbackAfterCallAPI(response, callback, runDefaultError) {
  await callback(response)

  //status 200
  if (requestStatus.SUCCESS.includes(response.status)) return true

  const status = response.response.status

  //status 401
  if (isHandleDefaultError(runDefaultError.error401) && status === requestStatus.UNAUTHORIZED) {
    callDispatch(authConstant.USER_LOGOUT_REQUEST, true)
  }

  //status 403
  if (isHandleDefaultError(runDefaultError.error403) && status === requestStatus.FORBIDDEN) {
    history.push('/403')
  }

  //status 404
  if (isHandleDefaultError(runDefaultError.error404) && response.response.status === requestStatus.NOT_FOUND) {
    history.push('/404')
  }

}

function isHandleDefaultError(error) {
  if (typeof error === 'undefined')
    return true
  if (error)
    return true
  return false
}

function callDispatch(constant, isLoading) {
  if (!isLoading) return null
  store.dispatch({ type: constant })
}
