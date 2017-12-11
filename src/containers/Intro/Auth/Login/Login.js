import React, { Component } from 'react'
import styles from './Login.css'

import { connect } from 'react-redux'
import { loginUser, spinnerStart, spinnerStop } from '../../../../store/actions/index'

import { auth } from '../../../../firebase/firebase'

import validationMethods from '../../../../hoc/validationMethods'
import NoRootElement from '../../../../hoc/NoRootElement'
import Input from '../../../../components/UI/Input/Input'
import Button from '../../../../components/UI/Button/Button'

class Login extends Component {
  state = {
    formIsValid: false,
    formErrorMessage: '',
    form: {
      email: {
        tagType: 'input',
        value: '',
        label: 'Email:',
        validation: {
          state: {
            isValid: false,
            isTouched: false,
            errorMessage: ''
          },
          rules: {
            required: true,
            type: 'email'
          }
        }
      },
      password: {
        tagType: 'input',
        value: '',
        label: 'Password:',
        type: 'password',
        validation: {
          state: {
            isValid: false,
            isTouched: false,
            errorMessage: ''
          },
          rules: {
            required: true,
            minLength: 6
          }
        }
      }
    }
  }

  handleInputChange = (inputKey, e) => {
    const form = {...this.state.form}
    const input = {...form[inputKey]}
    const validation = {...input.validation}
    const validationState = {...validation.state}

    input.value = e.target.value.trim().toLowerCase()
    validationState.isTouched = true

    const validationResult = this.props.checkValidity(input.value, validation.rules)
    validationState.isValid = validationResult.isValid
    validationState.errorMessage = validationResult.errorMessage

    validation.state = validationState
    input.validation = validation
    form[inputKey] = input

    const formIsValid = this.props.formIsValidCheck(form)

    this.setState({
      form, 
      formIsValid, 
      formErrorMessage: ''
    })
  }

  handleLoginClick = (e) => {
    if (e.key && e.key !== 'Enter') return;

    this.props.onSpinnerStart()
    auth.signInWithEmailAndPassword(this.state.form.email.value, this.state.form.password.value)
      .then( () => this.props.onSpinnerStop() )
      .catch(error => {
        this.setState({formErrorMessage: error.message})
        this.props.onSpinnerStop()
    });
  }

  render() {
    const inputsArray = []

    Object.keys(this.state.form).forEach(input => {
      inputsArray.push({
        key: input,
        inputConfig: this.state.form[input]
      })
    })

    const inputs = inputsArray.map(input => {
      return (
        <Input
          tagType={input.inputConfig.tagType}
          type={input.inputConfig.type}
          value={input.inputConfig.value}
          change={e => this.handleInputChange(input.key, e)}
          keyPress={this.handleLoginClick}
          key={input.key}
          label={input.inputConfig.label}
          notValid={!input.inputConfig.validation.state.isValid && input.inputConfig.validation.state.isTouched}
          errorMessage={input.inputConfig.validation.state.errorMessage}
        />
      )
    })

    return (
      <NoRootElement>
        {inputs}
        <span className={styles.LoginError}>{this.state.formErrorMessage}</span>
        <Button onClick={this.handleLoginClick} disabled={!this.state.formIsValid} style={{marginTop: '5px'}}>Login</Button>
        <Button onClick={this.props.onToggleAuth} style={{marginTop: '15px'}}>I haven't account</Button>
      </NoRootElement>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onloginUser: email => dispatch( loginUser(email) ),
    onSpinnerStart: () => dispatch( spinnerStart() ),
    onSpinnerStop: () => dispatch( spinnerStop() )
  }
}
 
export default connect(null, mapDispatchToProps)( validationMethods(Login) )
