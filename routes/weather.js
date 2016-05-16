'use strict'

const express     = require( 'express' );
const request     = require('request');
const weather     = express.Router();
const bodyParser  = require( 'body-parser' );
const db          = require( '../db/pgp.js' );
var data = '';

weather.get('/savedlocations', db.grabLocation, (req, res) => {res.send(res.rows)})
weather.put('/update', db.updateLocation, (req, res) => {res.send(res.rows)})
weather.delete('/delete', db.deleteLocation, (req, res) => {res.send('deleted')})

weather.route('/')
  .get(searchWeather, (req,res) => {
    res.send(data);
  })
  .post(db.saveLocation, (req, res) => {
    res.send(res.rows);
  })

function searchWeather(req, res, next) {
  request(`http://api.wunderground.com/api/${process.env.API_KEY}/conditions/q/${req.query.location}.json`, function(er, response, body) {
    data = JSON.parse(body);
    next();
  })
}

module.exports = weather;
