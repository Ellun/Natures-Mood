import $ from 'jquery';
import React, {Component} from 'react';

export default class WeatherList extends Component {
  render() {
    if (this.props.weather) {
      let details = this.props.weather.current_observation;
      return (
        <form className="search-location" onSubmit={this.handleSubmit.bind(this)}>
          <h3>{details.observation_location.full}</h3>
          <div className="update-time">{details.observation_time}</div>
          <strong>Weather:</strong> {details.weather}
          <br />
          <strong>Temperature:</strong> {details.temperature_string}
          <br />
          <strong>Humidity:</strong> {details.relative_humidity}
          <br/>
          <strong>Hourly Precipitation:</strong> {details.precip_1hr_string}
          <br />
          <button className="save" type="submit">Save Location</button>
        </form>
      )
    } else if (this.props.error){
      return (
        <div className="search-location">
          <h4>{this.props.error}</h4>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    let time_added = $.now();
    $.post({
      url: '/weather',
      data : {
        zip: this.props.weather.current_observation.display_location.zip,
        fullLocation: this.props.weather.current_observation.display_location.full,
        weather: this.props.weather.current_observation.weather,
        temperature: this.props.weather.current_observation.temperature_string,
        humidity: this.props.weather.current_observation.relative_humidity,
        precipitation: this.props.weather.current_observation.precip_1hr_string,
        last_updated: this.props.weather.current_observation.observation_time,
        time_added: time_added
      },
      beforeSend: function( xhr ) {
        xhr.setRequestHeader( "Authorization", 'Bearer ' + localStorage.token );
      }
    })
    .done((data) => {
      this.props.saved(data);
    })
  }
}
