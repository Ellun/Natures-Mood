const express     = require( 'express' );
const jwt         = require( 'jsonwebtoken' );
const request     = require('request');
const weather     = express.Router();
const bodyParser  = require( 'body-parser' );
const db          = require( '../db/pgp.js' );

weather.route('/')
  .get(searchWeather, (req,res) => {
    res.send(res.rows)
  })

function searchWeather(req, res, next) {
  request(`http://api.wunderground.com/api/${process.env.API_KEY}/conditions/q/CA/San_Francisco.json`, function(er, response, body) {
    console.log(body);
  })
}

module.exports = weather;
