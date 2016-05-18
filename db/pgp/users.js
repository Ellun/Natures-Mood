const bcrypt = require('bcrypt');
const salt   = bcrypt.genSaltSync(10);
const pgp    = require('pg-promise')({});

if (process.env.ENVIRONMENT === 'production') {
  var cn = process.env.DATABASE_URL;
} else {
  var cn = {
      host: 'localhost', // server name or IP address;
      port: 5432,
      database: process.env.DB, // database name
      user: process.env.DB_USER, // computer username
      password: process.env.DB_PASS // computer password
  };
}

const db = pgp(cn);

function createUser(req, res, next) {
  createSecure(req.body.username, req.body.password, saveUser);
  function saveUser(username, hash) {
    db.one('INSERT INTO users (username, password_digest) VALUES($1, $2)\
     returning username, password_digest;', [username, hash])
    .then((data) => {
      res.rows = data;
      next();
    })
    .catch((error) => {
      res.rows = 'error';
      next();
    });
  }
}

function createSecure(username, password, callback) {
  // hashing the password given by the user at signup
  bcrypt.genSalt((err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      //this callback saves the user to our database
      //with the hashed password
      callback(username, hash);
    })
  })
}

function loginUser(req, res, next) {
  db.one('SELECT * FROM users WHERE username LIKE $1;', [req.body.username])
    .then((data) => {
      if (bcrypt.compareSync(req.body.password, data.password_digest)) {
        res.rows = data
        next()
      } else {
        res.rows = 'error';
        next();
      }
    })
    .catch( () => {
      res.rows = 'error';
      next();
    })
}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
