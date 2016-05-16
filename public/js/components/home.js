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
        <WeatherListItem update={this.update.bind(this)} location={location.location} weather={location.weather} zip={location.zip} temperature={location.temperature} key={location.location + location.weather}/>
      )
    })

    return (
      <div>
        <SearchBar passData={this.handleData.bind(this)}/>
        <WeatherList saved={this.saved.bind(this)} error={this.state.error} weather={this.state.weather}/>
        <div className="location-items">{locationItems}</div>
      </div>
    )
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
                temperature: data.temperature
              });
            })
          })
        } else {
          array.push({
            location: location.full_location,
            zip: location.zip,
            weather: location.weather,
            temperature: location.temperature
          });
        }
      })
      this.setState({locations:array});
    })
  }
}
