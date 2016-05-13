import $ from 'jquery';
import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import SearchBar from './search_bar';
import WeatherList from './weather_list';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: ''
    }
  }

  handleData(data) {
    this.setState({weather: data});
  }

  render() {
    if (!localStorage.token) {
      browserHistory.push('/login');
    }
    return (
      <div>
        <SearchBar passData={this.handleData.bind(this)}/>
        <WeatherList weather={this.state.weather}/>
      </div>
    )
  }
}
