const express     = require( 'express' );
const expressJWT  = require( 'express-jwt' );
const jwt         = require( 'jsonwebtoken' );
const users       = express.Router();
const bodyParser  = require( 'body-parser' );
const db          = require( '../db/pgp.js' );
const SECRET     = process.env.SECRET;


users.use( function( error, request, response, next ) {
 if( error.name === 'UnauthorizredError' ) {
   response.status( 401 ).json( { message: 'sorry, the information you entered did not match our records'} );
 }
});

users.post('/login', db.loginUser, ( req, res ) => {
  var token = jwt.sign( res.rows, SECRET );
  res.json( { agent: res.rows, token: token } );
});

users.route('/signup')
  .get((req,res) => {res.json({data:'success'});})
  .post(db.createUser,(req, res) => {
    var token = jwt.sign( res.rows, SECRET );
    res.json( { agent: res.rows, token: token } );
});


module.exports = users;
