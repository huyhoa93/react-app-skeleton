import React from 'react'

import { authConstant } from '../../constant'

class Logout extends React.Component {

  render() {
    const { dispatch } = this.props
    dispatch({
      type: authConstant.USER_LOGOUT_REQUEST
    })
    return null
  }
}

export default Logout
