import $ from 'jquery';
import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: ''
    }
  }

  render() {
    if (localStorage.token) {
      browserHistory.push('/home');
    }
    return (
      <form className="login-form" onSubmit={this.handleSubmit.bind(this)}>
        <h1>Natures Mood</h1>
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
        <h4>Need an account?</h4>
        <Link to="/signup">Signup</Link>
      </form>
    )
  }

  onUsernameChange(username) {
    this.setState({username});
  }

  onPasswordChange(password) {
    this.setState({password});
  }

  handleSubmit(event) {
    event.preventDefault(); // prevents page from refreshing
    let error = 'Oops, please check your username or password';
    if (this.state.username == '' || this.state.password == '') { // checks for real username/password
      this.setState({error:error})
    }
    $.post('/users/login', { // AJAX post request to users/login route
      username: this.state.username,
      password: this.state.password
    })
    .done((data) => {
      if (data.agent == 'error') { // if username/password doesn't match
        this.setState({error:error})
      } else { // if login is successful
        localStorage.token = data.token;
        browserHistory.push('/home');
      }
    })
  }
}

Login.contextTypes = {
  router: React.PropTypes.object
}
