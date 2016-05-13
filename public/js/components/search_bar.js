import $ from 'jquery';
import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {location: ''};
  }

  render() {
    return (
      <div className="search-bar">
        <input
        placeholder="zipcode"
        value={this.state.location}
        onChange={event => this.onInputchange(event.target.value)}/>
      </div>
    );
  }

  onInputchange(location) {
    this.setState({location});
    $.get('/weather', {
      location: this.state.location
    })
  }
}
