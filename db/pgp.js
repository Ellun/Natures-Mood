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
  db.none('INSERT INTO location(user_id, zip, full_location, weather, temperature, relative_humidity, precip_1hr_string, observation_time, time_added, icon) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [req.user.user_id, req.body.zip, req.body.fullLocation, req.body.weather, req.body.temperature, req.body.humidity, req.body.precipitation, req.body.last_updated, req.body.time_added, req.body.icon])
  .then (()=>{
    next();
  })
  .catch((error) => {
    res.rows = "error";
    next();
  })
}

function grabLocation(req, res, next) {
  db.any('SELECT * FROM location WHERE user_id=($1)', [req.user.user_id])
  .then((data) => {
    res.rows = data;
    next();
  })
  .catch(() => {
    res.rows = 'error';
    console.log(res.rows);
    next();
  })
}


function updateLocation (req, res, next) {
  db.many("UPDATE location SET weather=($1), temperature=($2), relative_humidity=($3), precip_1hr_string=($4), observation_time=($5), time_added=($6), icon=($7) WHERE user_id=($8) and zip=($9) returning weather, temperature, relative_humidity, precip_1hr_string, observation_time, icon ", [req.body.weather , req.body.temperature, req.body.humidity, req.body.precipitation, req.body.last_updated, req.body.time_updated, req.body.icon, req.user.user_id, req.body.location])
  .then((data) => {
    res.rows = data
    next();
  })
  .catch((error) => {
    console.log('ERROR: ', error);
    next();
  })
}

function deleteLocation (req, res, next) {
  db.none("DELETE FROM location WHERE user_id=($1) and zip=($2)", [req.user.user_id, req.body.zip])
  .then(() => {
    next();
  })
}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.saveLocation = saveLocation;
module.exports.grabLocation = grabLocation;
module.exports.updateLocation = updateLocation;
module.exports.deleteLocation = deleteLocation;
