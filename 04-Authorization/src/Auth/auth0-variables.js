export const AUTH_CONFIG = {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
    callbackUrl: process.env.REACT_APP_AUTH0_CALLBACK_URL,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    appUrl: process.env.REACT_APP_URL,
    scopes: 'openid profile'
};
