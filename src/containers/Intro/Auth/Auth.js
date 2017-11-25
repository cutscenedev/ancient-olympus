import React, { Component } from 'react'
import styles from './Auth.css'

import Login from './Login/Login'
import Register from './Register/Register'
import Modal from '../../../components/UI/Modal/Modal'


class Auth extends Component {
  state = {
    regIsActive: false
  }

  handleRegOpenClick = () => {
    this.setState({regIsActive: true})
  }

  handleRegCloseClick = () => {
    this.setState({regIsActive: false})
  }


  render() {
    return (
      <div className={styles.Auth}>
        <Modal active={this.props.authIsActive} click={this.props.authClose}>
          {this.state.regIsActive ? (
            <Register 
              handleRegCloseClick={this.handleRegCloseClick}
            />
          ) : (
            <Login
              handleRegOpenClick={this.handleRegOpenClick}
            />
          )}
        </Modal>
      </div>
    )
  }
}

export default Auth