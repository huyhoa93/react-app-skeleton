import React from 'react'
import { connect } from 'react-redux'

export class List extends React.Component {
  render() {
    return (
      <p>User List</p>
    )
  }
}

function mapPropsToState(state) {
  return {
    auth: state.authReducer
  }
}

export default connect(mapPropsToState)(List)