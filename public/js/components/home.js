import $ from 'jquery';
import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import SearchBar from './search_bar';
import WeatherList from './weather_list';
import WeatherListItem from './weather_list_item';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: '',
      locations: []
    }

    $.get({
      url: '/weather/savedLocations',
      beforeSend: function( xhr ) {
        xhr.setRequestHeader( "Authorization", 'Bearer ' + localStorage.token );
      }
    })
    .done((data) => {
      let array = [];
      data.map((location) => {
        array.push(location.full_location);
      })
      this.setState({locations:array});
    })
  }

  render() {
    if (!localStorage.token) {
      browserHistory.push('/login');
    }

    const locationItems = this.state.locations.map((location) => {
      return (
        <WeatherListItem location={location} key={location}/>
      )
    })

    return (
      <div>
        <SearchBar passData={this.handleData.bind(this)}/>
        <WeatherList weather={this.state.weather}/>
        {locationItems}
      </div>
    )
  }

  handleData(data) {
    this.setState({weather: data});
  }
}
