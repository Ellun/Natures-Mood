import React, {Component} from 'react';
import WeatherListItem from './weather_list_item';

const WeatherList = (props) => {
  if (props.weather) {
    let details = props.weather.current_observation;
    return (
      <div>
        Location: {details.observation_location.full}
        <br />
        Weather: {details.weather}
        <br />
        Temperature: {details.temperature_string}
      </div>
    )
  } else {
    return (
      <h3>
        Search a location!
      </h3>
    )
  }
}

export default WeatherList;
