import $ from 'jquery';
import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = { // sets initial states
      username : '',
      password : '',
      confirmPassword : '',
      error : ''
    }
  }

  render() {
    if (localStorage.token) {
      browserHistory.push('/home'); // redirects to home if already logged in
    }
    return (
      <form className="signup-form" onSubmit={this.handleSubmit.bind(this)}>
        <h1>NATURE'S MOOD</h1>
        <input
          value={this.state.username}
          onChange={event => this.onUsernameChange(event.target.value)}
          placeholder="username" />
          <br />
        <input
          value={this.state.password}
          onChange={event => this.onPasswordChange(event.target.value)}
          type="password"
          placeholder="password" />
          <br />
        <input
          value={this.state.confirmPassword}
          onChange={event => this.onConfirmPasswordChange(event.target.value)}
          type="password"
          placeholder="confirm password" />
          <br />
        <button type="submit">Submit</button>
        <h5>{this.state.error}</h5>
        <br/>
        <h4>Already have an account?</h4>
        <Link to="/login">Login</Link>
      </form>
    )
  }

  onUsernameChange(username) {
    this.setState({username}); // updates username state
  }

  onPasswordChange(password) {
    this.setState({password}); // updates password state
  }

  onConfirmPasswordChange(confirmPassword) {
    this.setState({confirmPassword}); // updates confirms password state
  }

  handleSubmit(event) { // runs error checks
    event.preventDefault();
    if (this.state.username.length < 1){
      this.setState({error : 'Enter Username'});
    } else if (this.state.password != this.state.confirmPassword) {
      this.setState({error : 'Passwords do not match!'});
    } else if (this.state.password.length < 8) {
      this.setState({error : 'Password must be at least 8 characters'});
    } else {
      $.post('/users/signup', { // stores new user
        username : this.state.username,
        password : this.state.password
      })
      .done((data) => {
        if (data.agent == 'error') {
          this.setState({error : 'That user already exists'})
        } else {
          $.post('/users/login', { // logins
            username : this.state.username,
            password : this.state.password
          })
          .done((data) => {
            localStorage.token = data.token; // creates token
            browserHistory.push('/home'); // redirects to home
          })
        }
      })
    }
  }
}
