const bcrypt = require( 'bcrypt' );
const salt   = bcrypt.genSaltSync( 10 );
const pgp    = require( 'pg-promise' )({});

if(process.env.ENVIRONMENT === 'production') {
  var cn = process.env.DATABASE_URL;
} else {
  var cn = {
      host: 'localhost', // server name or IP address;
      port: 5432,
      database: process.env.DB,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
  };
}

const db = pgp(cn);

function createSecure(username, password, callback) {
  //hashing the password given by the user at signup
  bcrypt.genSalt(function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      //this callback saves the user to our databoard
      //with the hashed password
      callback(username, hash);
    })
  })
}

function createUser( req, res, next ) {
  createSecure( req.body.username, req.body.password, saveUser );
  function saveUser( username, hash ) {
    db.one( "INSERT INTO users (username, password_digest ) VALUES($1, $2) returning username, password_digest;", [ username, hash ] )
    .then(function ( data ) {
      // success;
      res.rows = data;
      next();
    })
    .catch( function (error) {
      res.rows = 'error';
      next();
    });
  }
}

function loginUser( req, res, next ) {
  const username = req.body.username
  const password = req.body.password
  db.one( "SELECT * FROM users WHERE username LIKE $1;", [ username ] )
    .then( ( data ) => {
      if ( bcrypt.compareSync( password, data.password_digest ) ) {
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

function saveLocation(req, res, next) {
  db.none('INSERT INTO location(user_id, zip, full_location) VALUES($1, $2, $3)', [req.user.user_id, req.body.zip, req.body.fullLocation])
  .then (()=>{
    next();
  })
  .catch((error) => {
    console.log(error)
  })
}

function grabLocation(req, res, next) {
  db.any('SELECT full_location FROM location WHERE user_id=($1)', [req.user.user_id])
  .then((data) => {
    res.rows = data;
    console.log(res.rows);
    next();
  })
  .catch(() => {
    res.rows = 'error';
    console.log(res.rows);
    next();
  })
}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.saveLocation = saveLocation;
module.exports.grabLocation = grabLocation;
