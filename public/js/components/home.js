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
      locations: [],
      error: ''
    }
    this.update();
  }

  render() {
    if (!localStorage.token) {
      browserHistory.push('/login');
    }

    const locationItems = this.state.locations.map((location) => {
      return (
        <WeatherListItem update={this.update.bind(this)} humidity={location.relative_humidity} precipitation={location.precip_1hr_string} location={location.location} weather={location.weather} zip={location.zip} observation_time={location.observation_time} temperature={location.temperature} key={location.location + location.weather}/>
      )
    })

    return (
      <div>
        <div className="navbar">
          <h1 className="title">NATURES MOOD</h1>
          <button className="logout" onClick={this.handleLogout.bind(this)}>Logout</button>
          <SearchBar passData={this.handleData.bind(this)}/>
        </div>
        <br/>
        <WeatherList saved={this.saved.bind(this)} error={this.state.error} weather={this.state.weather}/>
        <div className="location-items">{locationItems}</div>
      </div>
    )
  }

  handleLogout(event) {
    event.preventDefault();
    delete localStorage.token;
    browserHistory.push('/login');
  }

  handleData(data) {
    if (data.response.error) {
      this.setState({error: 'oops, check location'})
      this.setState({weather: ''});
    }
    this.setState({weather: data});
  }

  saved(data) {
    if (data == 'error') {
      this.setState({weather: '', error: 'You are already tracking this location!'})
    } else {
      this.setState({weather: '', error: ''});
      this.update();
    }
  };

  update() {
    $.get({
      url: '/weather/savedLocations',
      beforeSend: function( xhr ) {
        xhr.setRequestHeader( "Authorization", 'Bearer ' + localStorage.token );
      }
    })
    .done((data) => {
      let array = [];
      data.map((location) => {
        let savedTime = parseInt(location.time_added) + 900000; // updates every 15 mins
        let currentTime = $.now();
        if (currentTime >= savedTime) {
          $.get({
            url : '/weather',
            data : {
              location: location.zip
            },
            beforeSend: function( xhr ) {
              xhr.setRequestHeader( "Authorization", 'Bearer ' + localStorage.token );
            }
          })
          .done((data) => {
            let currentTime = $.now();
            $.ajax({
              url : '/weather/update',
              type : 'PUT',
              data : {
                weather : data.current_observation.weather,
                temperature : data.current_observation.temperature_string,
                humidity: data.current_observation.relative_humidity,
                precipitation: data.current_observation.precip_1hr_string,
                last_updated: data.current_observation.observation_time,
                location : location.zip,
                time_updated : currentTime
              },
              beforeSend: function( xhr ) {
                xhr.setRequestHeader( "Authorization", 'Bearer ' + localStorage.token );
              }
            })
            .done((data) => {
              array.push({
                location: location.full_location,
                zip: location.zip,
                weather: data.weather,
                temperature: data.temperature,
                relative_humidity: data.relative_humidity,
                precip_1hr_string: data.precip_1hr_string,
                observation_time: data.observation_time
              });
            })
          })
        } else {
          array.push({
            location: location.full_location,
            zip: location.zip,
            weather: location.weather,
            temperature: location.temperature,
            relative_humidity: location.relative_humidity,
            precip_1hr_string: location.precip_1hr_string,
            observation_time: location.observation_time
          });
        }
      })
      this.setState({locations:array});
    })
  }
}
