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
      <form className="search-bar" onSubmit={this.handleSubmit.bind(this)}>
        <input
        placeholder="zipcode"
        value={this.state.location}
        onChange={event => this.onInputchange(event.target.value)}/>
      </form>
    );
  }

  onInputchange(location) {
    this.setState({location});
  }

  handleSubmit(event) {
    event.preventDefault();
    $.get('/weather', {
      location: this.state.location
    })
    .done((data) => {
      this.props.passData(data);
    })
  }
}
