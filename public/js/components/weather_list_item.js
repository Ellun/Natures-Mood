import $ from 'jquery';
import React, {Component} from 'react';

export default class WeatherListItem extends Component {
  render() {
    let style = {
      backgroundImage : `url(${this.props.icon})`
    }

    return (
      <form className="saved-locations" onSubmit={this.handleSubmit.bind(this)}>
        <div className="weather-icon" style={style}></div>
        <h3><strong>{this.props.location}</strong></h3>
        <div className="update-time">{this.props.observation_time}</div>
        <strong>Weather:</strong> {this.props.weather}
        <br />
        <strong>Temperature:</strong> {this.props.temperature}
        <br />
        <strong>Humidity:</strong> {this.props.humidity}
        <br/>
        <strong>Hourly Precipitation:</strong> {this.props.precipitation}
        <br />
        <div className="delete"><button type="submit">Delete</button></div>

      </form>
    )
  }

  handleSubmit(event) {
    event.preventDefault();
    $.ajax({
      url : '/weather/delete',
      data : {
        zip : this.props.zip
      },
      type : 'DELETE',
      beforeSend: function( xhr ) {
        xhr.setRequestHeader( "Authorization", 'Bearer ' + localStorage.token );
      }
    })
    .done((data) => {
      this.props.update();
    })
  }
}
