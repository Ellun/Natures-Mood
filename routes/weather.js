'use strict'

const express = require('express');
const request = require('request');
const weather = express.Router();
const db      = require('../db/pgp/weather.js');
var data      = '';

weather.get('/savedlocations', db.grabLocation, (req, res) => {res.send(res.rows)}) // grabs saved info
weather.put('/update', db.updateLocation, (req, res) => {res.send(res.rows)}) // updates saved info
weather.delete('/delete', db.deleteLocation, (req, res) => {res.send('deleted')}) // deletes saved info
weather.route('/')
  .get(searchWeather, (req,res) => {res.send(data)}) // searches for weather info
  .post(db.saveLocation, (req, res) => {res.send(res.rows)}) // saves weather info

function searchWeather(req, res, next) { // hits the api
  request(`http://api.wunderground.com/api/${process.env.API_KEY}/conditions/q/${req.query.location}.json`,
  (err, response, body) => {
    data = JSON.parse(body);
    next();
  })
}

module.exports = weather;
