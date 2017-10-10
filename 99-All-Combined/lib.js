// Used to generate access token via client cred exchange and store in cache

function getToken() {
  return new Promise(function (resolve, reject) {
    let options = {
      method: 'post',
      body: {
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        grant_type: 'client_credentials',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
      },
      json: true,
      url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`
    };
    request(options, function (err, res, body) {
      if (err) reject(err);
      if (body.error) {
        console.log(body);
        return reject('invalid access token response ' + body['error'] + ' ' + body['error_description']);
      }

      resolve(body.access_token);
    });
  });
}

function getProvider(provider, user) {
  return new Promise(function (resolve, reject) {
    for (let identity of user.identities) {
      if (identity.provider === 'facebook') {
        resolve(identity);
      }
    }
    reject(`${provider} not found`)
  })
}

module.exports = {
  getToken: getToken,
  getProvider: getProvider,
};