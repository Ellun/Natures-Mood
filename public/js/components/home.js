import $ from 'jquery';
import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import SearchBar from './search_bar';
import WeatherList from './weather_list';
import WeatherListItem from './weather_list_item';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = { // sets initial state
      weather : '',
      locations : [],
      error : ''
    }
    this.update(); // runs update function on start
  }

  render() {
    if (!localStorage.token) {
      browserHistory.push('/login'); // if not logged in, redirects you to login
    }

    const locationItems = this.state.locations.map((location) => { // creates a WeatherListItem component for each occurance
      return (
        <WeatherListItem icon={location.icon} update={this.update.bind(this)} humidity={location.relative_humidity} precipitation={location.precip_1hr_string} location={location.location} weather={location.weather} zip={location.zip} observation_time={location.observation_time} temperature={location.temperature} key={location.location + location.weather}/>
      )
    })

    return (
      <div>
        <div className="navbar">
          <h1 className="title">NATURE'S MOOD</h1>
          <button className="logout" onClick={this.handleLogout.bind(this)}>Logout</button>
          <SearchBar passData={this.handleData.bind(this)}/>
        </div>
        <br/>
        <WeatherList saved={this.saved.bind(this)} error={this.state.error} weather={this.state.weather}/>
        <div className="location-items">{locationItems}</div>
      </div>
    )
  }

  handleLogout(event) { // deletes token and logs you out
    event.preventDefault();
    delete localStorage.token;
    browserHistory.push('/login');
  }

  handleData(data) { // weather data grabbed from SearchBar component
    if (data.response.error) {
      this.setState({error : 'oops, check location'})
      this.setState({weather : ''});
    }
    this.setState({weather : data});
  }

  saved(data) { // saves a location and rerenders page
    if (data == 'error') { // stops you from saving same location
      this.setState({weather: '', error: 'You are already tracking this location!'})
    } else {
      this.setState({weather: '', error: ''});
      this.update();
    }
  };

  update() { // renders saved locations and checks if location needs to be updated
    $.get({
      url : '/weather/savedLocations',
      beforeSend : function( xhr ) {
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
              location : location.zip
            },
            beforeSend : function( xhr ) {
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
                humidity : data.current_observation.relative_humidity,
                precipitation : data.current_observation.precip_1hr_string,
                last_updated : data.current_observation.observation_time,
                location : location.zip,
                time_updated : currentTime,
                icon : data.current_observation.icon_url
              },
              beforeSend : function( xhr ) {
                xhr.setRequestHeader( "Authorization", 'Bearer ' + localStorage.token );
              }
            })
            .done((data) => {
              array.push({
                location : location.full_location,
                zip : location.zip,
                weather : data.weather,
                temperature : data.temperature,
                relative_humidity : data.relative_humidity,
                precip_1hr_string : data.precip_1hr_string,
                observation_time : data.observation_time,
                icon : data.icon
              });
            })
          })
        } else {
          array.push({
            location : location.full_location,
            zip : location.zip,
            weather : location.weather,
            temperature : location.temperature,
            relative_humidity : location.relative_humidity,
            precip_1hr_string : location.precip_1hr_string,
            observation_time : location.observation_time,
            icon : location.icon
          });
        }
      })
      this.setState({locations : array});
    })
  }
}
