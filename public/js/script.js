import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Navigation, Link, browserHistory, IndexRoute} from 'react-router';

import Signup from './components/signup';
import Login from './components/login';

class App extends Component {
  render() {
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
  </Router>
)

ReactDOM.render(routes, document.querySelector('.container'));
