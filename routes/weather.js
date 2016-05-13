const express     = require( 'express' );
const request     = require('request');
const weather     = express.Router();
const bodyParser  = require( 'body-parser' );
const db          = require( '../db/pgp.js' );
let data = '';

weather.route('/')
  .get(searchWeather, (req,res) => {
    res.send(data)
  })

function searchWeather(req, res, next) {
  request(`http://api.wunderground.com/api/${process.env.API_KEY}/conditions/q/${req.query.location}.json`, function(er, response, body) {
    data = JSON.parse(body);
    res.data = data
    next();
  })
}

module.exports = weather;
