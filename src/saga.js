import { all } from 'redux-saga/effects'
import { UserRegisterLoginWatcher } from './user/saga'

const IndexSagas = function*() {
  yield all([
    UserRegisterLoginWatcher()
  ])
}

export default IndexSagas
