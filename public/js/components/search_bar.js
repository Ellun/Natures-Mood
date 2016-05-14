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
    $.get({
      url : '/weather',
      data : {
        location: this.state.location
      },
      beforeSend: function( xhr ) {
        xhr.setRequestHeader( "Authorization", 'Bearer ' + localStorage.token );
      }
    })
    .done((data) => {
      this.props.passData(data);
    })
  }
}
