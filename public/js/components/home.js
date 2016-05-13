import $ from 'jquery';
import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import SearchBar from './search_bar';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: {}
    }
  }

  render() {
    if (!localStorage.token) {
      browserHistory.push('/login');
    }
    return (
      <SearchBar passData={this.handleData}/>
    )
  }

  handleData(data) {
    console.log(data);
  }
}
