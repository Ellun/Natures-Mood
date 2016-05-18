const express = require('express');
const jwt     = require('jsonwebtoken');
const users   = express.Router();
const db      = require('../db/pgp/users.js');
const SECRET  = process.env.SECRET;

users.post('/login', db.loginUser, (req, res) => {
  var token = jwt.sign(res.rows, SECRET);
  res.json({agent: res.rows, token: token});
});

users.route('/signup')
  .post(db.createUser, (req, res) => {
    var token = jwt.sign(res.rows, SECRET);
    res.json({agent: res.rows, token: token});
});


module.exports = users;
