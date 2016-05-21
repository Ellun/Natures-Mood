'use strict'
import React, {Component} from 'react'; // requires react
import ReactDOM from 'react-dom'; // requires reactDOM
import {Router, Route, Navigation, Link, browserHistory, IndexRoute} from 'react-router';
import Signup from './components/signup'; // links to Signup component
import Login from './components/login'; // links to Login component
import Home from './components/home'; // links to Home component

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: []
    }
  }

  render() {
    browserHistory.push('/login'); // directs to home page
  }
}

const routes = (
  <Router history={browserHistory} >
    <IndexRoute component={Login} />
    <Route path="/" component={App} />
    <Route path="/signup" component={Signup} />
    <Route path="/login" component={Login} />
    <Route path="/home" component={Home} />
  </Router>
)

ReactDOM.render(routes, document.querySelector('.container'));
