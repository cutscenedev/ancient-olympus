import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

import NoRootElement from '../../../../hoc/NoRootElement'
import Input from '../../../../components/UI/Input/Input'
import Button from '../../../../components/UI/Button/Button'

class Login extends Component {
  state = {
    form: {
      login: {
        tagType: 'input',
        placeholder: '',
        value: '',
        label: 'Login Name:',
        warning: ''
      },
      password: {
        tagType: 'input',
        placeholder: '',
        value: '',
        label: 'Password:',
        type: 'password',
        warning: ''
      }
    }
  }
  
  changeInputsWarning = (inputKey, warning) => {
    const newForm = {...this.state.form}
    const newInput = {...newForm[inputKey]}

    newInput.warning = warning
    newForm[inputKey] = newInput

    this.setState({form: newForm})
  }

  handleInputChange = (inputKey, e) => {
    const newForm = {...this.state.form}
    const newInput = {...newForm[inputKey]}

    newInput.value = e.target.value
    newForm[inputKey] = newInput

    this.setState({form: newForm}, () => this.changeInputsWarning(inputKey, ''))
  }

  inputsPreValidation = () => {
    let invalid = false;

    Object.keys(this.state.form).forEach((input) => {
      if (this.state.form[input].value.length < 1) {
        invalid = true;
        this.changeInputsWarning(input, 'incorrect length of input')
      }
    })

    return invalid;
  }

  inputsValidation = (data) => {
    const login = this.state.form.login.value
    const password = this.state.form.password.value
    const access = {status: false, name: ''}
    const warning = {input: '', text: ''}
     
    Object.keys(data).forEach((user) => {
      if (access.status || warning.input === 'password') return;

      if (data[user].login === login) {
        if (data[user].password === password) {
          access.status = true
          access.name = login
        } else {
          warning.input = 'password'
          warning.text = 'password incorect'
        }
      } else {
        warning.input = 'login'
        warning.text = 'such user doesn\'t exist'
      }
    })

    if (!access.status) {
      this.changeInputsWarning(warning.input, warning.text)
    }
    return access;
  }

  handleLoginClick = (e) => {
    if (e.key && e.key !== 'Enter') return;
    if ( this.inputsPreValidation() ) return;

    axios.get('/login.json')
      .then((response) => {
        if (response.status !== 200) {
          console.error(response.statusText)
          return;
        }

        if (Object.keys(response.data).length < 1) {
          console.error('Server Data is empty')
          return;
        }

        const access = this.inputsValidation(response.data)
        if (access.status && access.name) {
          this.props.loginUser(access.name)
        }
      })
      .catch(error => console.error(error))
  }

  render() {
    const inputsArray = []

    Object.keys(this.state.form).forEach((input, index) => {
      inputsArray.push({
        key: input,
        inputConfig: this.state.form[input]
      })
    })

    const inputs = inputsArray.map((input) => {
      return (
        <Input
          tagType={input.inputConfig.tagType}
          placeholder={input.inputConfig.placeholder}
          value={input.inputConfig.value}
          change={(e) => this.handleInputChange(input.key, e)}
          keyPress={this.handleLoginClick}
          type={input.inputConfig.type}
          key={input.key}
          warning={input.inputConfig.warning}
          label={input.inputConfig.label}
        />
      )
    })

    return (
      <NoRootElement>
        {inputs}
        <Button handleClick={this.handleLoginClick} style={{marginTop: '5px'}}>Login</Button>
        <Button handleClick={this.props.handleRegOpenClick} style={{marginTop: '15px'}}>I haven't account</Button>
      </NoRootElement>
    )
  }

}

const mapDispatchToProps = dispatch => {
  return {
    loginUser: payload => dispatch({type: 'LOGINUSER'}, payload)
  }
}

export default connect(null, mapDispatchToProps)(Login)