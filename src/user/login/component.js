import React from 'react'
import * as EmailValidator from 'email-validator'
import { connect } from 'react-redux'
import { authConstant } from '../../constant'

export class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loginForm: {
        email: '',
        password: '',
        isSave: false,
        isEmailValid: true,
        messageValidateEmail: '* Please enter your email address exactly !',
        messageValidateForm: '* Your email address or password is incorrect !',
      }
    }
  }

  handleChange(e) {
    this.removeValidateWarning()
    const name = e.target.name
    const value = e.target.value
    this.setState({
      loginForm: { ...this.state.loginForm, [name]: value }
    })
  }

  removeValidateWarning = () => {
    let loginForm = this.state.loginForm
    loginForm.isEmailValid = true
    this.setState({
      loginForm: loginForm
    })
  }

  handleChangeCheckbox = () => {
    this.setState({
      loginForm: { ...this.state.loginForm, isSave: !this.state.loginForm.isSave }
    })
  }

  handleSubmit = () => {
    this.removeValidateWarning()
    const email = this.state.loginForm.email
    const password = this.state.loginForm.password

    if (!EmailValidator.validate(email)) {
      this.setState({
        loginForm: { ...this.state.loginForm, isEmailValid: false }
      })
      return null
    }

    const { dispatch } = this.props
    dispatch({
      type: authConstant.USER_LOGIN_REQUEST,
      data: {
        email: email,
        password: password,
        isKeepLogin: this.state.loginForm.isSave
      }
    })
  }

  renderMessage = () => {
    if (!this.state.loginForm.isEmailValid) {
      return <p className="text-danger">{this.state.loginForm.messageValidateEmail}</p>
    }
    if (this.props.auth.error) {
      return <p className="text-danger">{this.props.auth.message}</p>
    }
  }

  render() {
    return (
      <div className="login-block">
        <div className="container">
          {this.renderMessage()}
          <label><b>Email</b></label>
          <input
            type="text"
            placeholder="Enter Email"
            name="email"
            onChange={(e) => this.handleChange(e)}
            value={this.state.loginForm.email}
          />
          <label><b>Password</b></label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            onChange={(e) => this.handleChange(e)}
            value={this.state.loginForm.password}
          />
          <button
            type="button"
            disabled={this.state.loginForm.email === '' || this.state.loginForm.password === ''}
            onClick={() => this.handleSubmit()}
          >Login</button>
          <label>
            <input
              type="checkbox"
              name="remember"
              checked={this.state.loginForm.isSave} 
              onChange={() => this.handleChangeCheckbox()}
            />
            Remember me
          </label>
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

export default connect(mapPropsToState)(Login)