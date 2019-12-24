import React from 'react'
import { connect } from 'react-redux'
import ReactPagination from 'react-js-pagination'
import { history } from '../../history'
import { linkAPI, requestMethod } from '../../constant'
import { httpClient } from '../../utils/httpClient'
const queryString = require('query-string')

export class List extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      userList: [],
      isGetUser: false,
      userCount: 0,
      page: 1,
      per_page: 8,
    }
  }

  UNSAFE_componentWillMount() {
    this.getUserList()
  }

  componentDidUpdate() {
    const page = this.getCurrentPage()

    if (page !== this.state.page) {
      this.setState({
        page: page,
        isGetUser: true
      })
    }
    if (this.state.isGetUser) {
      this.getUserList()
      this.setState({
        isGetUser: false,
      })
    }
  }

  getCurrentPage () {
    const queryParams = queryString.parse(this.props.location.search)
    const page = typeof(queryParams.page) !== 'undefined' ? parseInt(queryParams.page) : 1
    return page
  }

  handleChangePage(e) {
    if (this.state.page === e)
      return false
    this.setState({
      page: e,
      isGetUser: true,
    })
    history.push(`/users?page=${e}`)
  }

  getUserList() {
    const { page, per_page } = this.state
    const linkGetUser = `${linkAPI.LINK}/api/users`
    const scope = this
    const params = {
      page,
      per_page
    }
    return httpClient(linkGetUser, requestMethod.GET, {
      callBack: function (response) {
        scope.setState({
          userCount: response.data.response.total,
          userList: response.data.response.users
        })
      },
      params
    })
  }

  render() {
    const users = this.state.userList.map(user => {
      return <div className = "user-item">
        <p className = "user-item-id">ID: {user.id}</p>
        <p className = "user-item-name">Name: {user.name}</p>
        <p className = "user-item-email">Email: {user.email}</p>
      </div>
    })
    return (
      <div className = "user-wrapper">
        <div className = "user-title">User List</div>
        <div className = "user-block">
          {users}
        </div>
        <div className = "user-pagination">
          <ReactPagination activePage={this.state.page}
            itemsCountPerPage={this.state.per_page}
            totalItemsCount={this.state.userCount}
            onChange={e => this.handleChangePage(e)} />
        </div>
      </div>
    )
  }
}

function mapPropsToState(state) {
  return {
    auth: state.authReducer
  }
}

export default connect(mapPropsToState)(List)