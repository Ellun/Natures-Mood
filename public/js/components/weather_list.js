import $ from 'jquery';
import React, {Component} from 'react';

export default class WeatherList extends Component {
  render() {
    if (this.props.weather) {
      let details = this.props.weather.current_observation;
      return (
        <form className="search-location" onSubmit={this.handleSubmit.bind(this)}>
          Location: {details.observation_location.full}
          <br />
          Weather: {details.weather}
          <br />
          Temperature: {details.temperature_string}
          <br />
          <button className="save" type="submit">Save Location</button>
        </form>
      )
    } else {
      return (
        <div className="search-location">
          <h3>Search for a location!</h3>
        </div>
      )
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    $.post({
      url: '/weather',
      data : {
        zip: this.props.weather.current_observation.display_location.zip,
        fullLocation: this.props.weather.current_observation.display_location.full
      },
      beforeSend: function( xhr ) {
        xhr.setRequestHeader( "Authorization", 'Bearer ' + localStorage.token );
      }
    })
    .done((data) => {
      console.log('update rendering');
    })
  }
}
