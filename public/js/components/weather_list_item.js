import $ from 'jquery';
import React, {Component} from 'react';

export default class WeatherListItem extends Component {
  render() {
    return (
      <form className="saved-locations" onSubmit={this.handleSubmit.bind(this)}>
        Location: {this.props.location}
        <br />
        Weather: {this.props.weather}
        <br />
        Temperature: {this.props.temperature}
        <br />
        <button type="submit">Delete</button>
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
