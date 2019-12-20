import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import IndexSagas from './saga'
import { authReducer } from './commonReducer'

const loggerMiddleware = createLogger()
const sagaMiddleware   = createSagaMiddleware()

const store = createStore(
  combineReducers({
    authReducer: authReducer
  }),
  applyMiddleware(
    loggerMiddleware,
    sagaMiddleware
  )
)

sagaMiddleware.run(IndexSagas)
export default store