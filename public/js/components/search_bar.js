import $ from 'jquery';
import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {location : ''};
  }

  render() {
    return (
      <form className="search-bar" onSubmit={this.handleSubmit.bind(this)}>
        <input
        placeholder="Enter City & State or Zip Code"
        value={this.state.location}
        onChange={event => this.onInputchange(event.target.value)}/>
      </form>
    );
  }

  onInputchange(location) {
    this.setState({location}); // updates location state
  }

  handleSubmit(event) {
    event.preventDefault();
    $.get({ // grabs searched location weather data
      url : '/weather',
      data : {
        location : this.state.location
      },
      beforeSend : function( xhr ) { // allows for user info access
        xhr.setRequestHeader( "Authorization", 'Bearer ' + localStorage.token );
      }
    })
    .done((data) => { // sends gathered data to parent
      this.props.passData(data);
    })
  }
}
