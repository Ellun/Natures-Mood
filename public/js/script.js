import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Navigation, Link, browserHistory, IndexRoute} from 'react-router';
import Signup from './components/signup';
import Login from './components/login';
import Home from './components/home';
const API_KEY = process.env.API_KEY;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: []
    }
  }

  render() {
    browserHistory.push('/home');
    return (
      <h1>
        Hello World!
      </h1>
    )
  }
}

const routes = (
  <Router history={browserHistory} >
    <Route path="/" component={App} />
    <Route path="/signup" component={Signup} />
    <Route path="/login" component={Login} />
    <Route path="/home" component={Home} />
  </Router>
)

ReactDOM.render(routes, document.querySelector('.container'));
