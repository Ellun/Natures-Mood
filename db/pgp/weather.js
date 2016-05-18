const pgp = require('pg-promise')({});

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

function saveLocation(req, res, next) {
  db.none('INSERT INTO\
    location(user_id, zip, full_location, weather, temperature,\
    relative_humidity, precip_1hr_string, observation_time, time_added, icon)\
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    [req.user.user_id, req.body.zip, req.body.fullLocation, req.body.weather,
    req.body.temperature, req.body.humidity, req.body.precipitation,
    req.body.last_updated, req.body.time_added, req.body.icon])
  .then (() => {
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
    next();
  })
}


function updateLocation (req, res, next) {
  db.many('UPDATE location\
    SET weather=($1), temperature=($2),relative_humidity=($3),\
    precip_1hr_string=($4), observation_time=($5), time_added=($6), icon=($7)\
    WHERE user_id=($8) and zip=($9) returning weather, temperature,\
    relative_humidity, precip_1hr_string, observation_time, icon',
    [req.body.weather , req.body.temperature, req.body.humidity,
    req.body.precipitation, req.body.last_updated, req.body.time_updated,
    req.body.icon, req.user.user_id, req.body.location])
  .then((data) => {
    res.rows = data
    next();
  })
  .catch((error) => {
    res.rows = 'error'
    next();
  })
}

function deleteLocation (req, res, next) {
  db.none('DELETE FROM location WHERE user_id=($1) and zip=($2)',
    [req.user.user_id, req.body.zip])
  .then(() => {
    next();
  })
}

module.exports.saveLocation = saveLocation;
module.exports.grabLocation = grabLocation;
module.exports.updateLocation = updateLocation;
module.exports.deleteLocation = deleteLocation;
