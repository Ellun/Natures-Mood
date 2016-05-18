import $ from 'jquery'; // requires jQuery for AJAX request
import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { // sets initial states
      username : '',
      password : '',
      error : ''
    }
  }

  render() {
    if (localStorage.token) { // checks if logged in
      browserHistory.push('/home'); // redirects to home if logged in
    }
    return (
      <form className="login-form" onSubmit={this.handleSubmit.bind(this)}>
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
        <button type="submit">Submit</button>
        <h5>{this.state.error}</h5>
        <br/>
        <h4>Need an account?</h4>
        <Link to="/signup">Signup</Link>
      </form>
    )
  }

  onUsernameChange(username) {
    this.setState({username}); // updates username state
  }

  onPasswordChange(password) {
    this.setState({password}); // updates password state
  }

  handleSubmit(event) {
    event.preventDefault(); // prevents page from refreshing
    let error = 'Oops, please check your username or password';
    if (this.state.username == '' || this.state.password == '') { // checks for real username/password
      this.setState({error:error})
    }
    $.post('/users/login', { // AJAX post request to users/login route
      username : this.state.username,
      password : this.state.password
    })
    .done((data) => {
      if (data.agent == 'error') { // if username/password doesn't match
        this.setState({error:error})
      } else { // if login is successful
        localStorage.token = data.token; // saves token to local storage
        browserHistory.push('/home');
      }
    })
  }
}
