import React, {Component} from 'react';

export default class WeatherListItem extends Component {
  render() {
    return (
        <form className="saved-locations">
        Location: {this.props.location}
        <br />
        Weather: {this.props.weather}
        <br />
        Temperature: {this.props.temperature}
        <br />
      </form>
    )
  }
}
