const express = require('express');
const app = express();
const jwt = require('express-jwt');
const request = require("request");
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const ManagementClient = require('auth0').ManagementClient;
const jwtPermissions = require('express-jwt-permissions')({permissionsProperty: 'scope'});
const staticFile = require('connect-static-file');
const FB = require('fb');
const utils = require('./lib');

require('dotenv').config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file'
}

app.use(cors());

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scope: "read:user_idp_tokens",
});


app.get('/api/public', function (req, res) {
  res.json({message: "Hello from a public endpoint! You don't need to be authenticated to see this."});
});

app.get('/api/private', checkJwt, jwtPermissions.check(['read:messages']), function (req, res) {
  res.json({message: "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this."});
});

app.post('/api/admin', checkJwt, jwtPermissions.check(['write:messages']), function (req, res) {
  res.json({message: "Hello from an admin endpoint! You need to be authenticated and have a scope of write:messages to see this."});
});

app.get('/api/identity_tokens', checkJwt, function (req, res) {
  auth0.getUser({id: req.user.sub})
    .then(user => {
      res.json({
        id: user.user_id,
        identities: user.identities
      });
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
});

app.get('/api/fb', checkJwt, function (req, res) {
  auth0.getUser({id: req.user.sub})
    .then(user => utils.getProvider('facebook', user))
    .then(provider => {
      console.log(`Calling Facebook API for user ${req.user.sub}`);
      const fb = new FB.Facebook({accessToken: provider.access_token});
      return Promise.all([
        fb.api(`/${provider.user_id}/likes`),
        fb.api(`/${provider.user_id}/friends`)
      ])
    })
    .then(result => {
      res.json({
        likes: result[0].data,
        friends: result[1].data
      });
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
});

app.use('/silent', staticFile(`${__dirname}/silent.html`));

// Handle errors
app.use(function (err, req, res, next) {
  console.log(err);
  if (err.code === 'permission_denied') {
    console.log('Insufficient scope or permissions to access endpoint');
    return res.status(401).json({message: 'insufficient permissions'});
  }
  if (err.name === 'UnauthorizedError') {
    console.log('Unauthorized JWT to access this endpoint');
    return res.status(401).json({message: 'invalid jwt token'});
  }
});

app.listen(3001);
console.log('API Server listening on http://localhost:3001.');