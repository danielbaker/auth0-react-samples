import jwtDecode from 'jwt-decode';
import Auth0Lock from 'auth0-lock';
import auth0 from 'auth0-js';
import Auth from './Auth'
import history from '../history';
import { AUTH_CONFIG } from './auth0-variables';

export default class AuthCustom extends Auth {
  userProfile;

  constructor() {
    super();
    this.getToken = this.getToken.bind(this);
    this.logoutSLO = this.logoutSLO.bind(this);
    this.loginLock = this.loginLock.bind(this);
    this.loginPasswordless = this.loginPasswordless.bind(this);

    // Init with scopes last set from localStorage or default from auth config
    this.setScopes(this.getScopes());
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/home');
      } else if (err) {
        history.replace('/home');
        console.log(err);
        alert(`Error: ${err.error} ${err.errorDescription}. Check the console for further details.`);
      }
    });
  }

  // Used to start passwordless login
  loginPasswordless() {
    this.auth0.authorize({ pwdless: 'link' });
  }

  // Used to display embedded login via lock
  loginLock() {
    this.auth0Lock.show();
  }

  // Redirect to home on successful Auth
  setSession(authResult) {
    super.setSession(authResult);
    // Redirect back to home
    history.replace('/home');
  }

  getToken(type) {
    const token = localStorage.getItem(type);
    if (!token) {
      throw new Error(`No ${type} token found`);
    }
    return token;
  }

  decodeToken(type) {
    try {
      return jwtDecode(this.getToken(type))
    } catch (err) {
      return {}
    }
  }

  logoutSLO() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('scopes');
    this.userProfile = null;

    // Perform SLO
    this.auth0.logout({ returnTo: `${AUTH_CONFIG.appUrl}/logout` });
  }

  renewToken(cb) {
    this.auth0.checkSession({},
      (err, result) => {
        if (err) {
          alert(
            `Could not get a new token using silent authentication (${err.error}).`
          );
        } else {
          this.setSession(result);
          alert(`Successfully renewed auth!`);
          if (cb) cb();
        }
      }
    );
  }

  getScopes() {
    let scopes = localStorage.getItem('authScopes');
    if (!scopes) this.setScopes(AUTH_CONFIG.scopes);
    return localStorage.getItem('authScopes');
  }

  setScopes(scopes) {
    localStorage.setItem('authScopes', scopes);

    this.auth0 = new auth0.WebAuth({
      domain: AUTH_CONFIG.domain,
      clientID: AUTH_CONFIG.clientId,
      redirectUri: AUTH_CONFIG.callbackUrl,
      audience: AUTH_CONFIG.audience,
      responseType: 'token id_token',
      scope: scopes
    });

    this.auth0Lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, {
      auth: {
        redirectUrl: `${AUTH_CONFIG.appUrl}/callback`,
        responseType: 'token id_token',
        params: {
          scope: scopes // Learn about scopes: https://auth0.com/docs/scopes
        },
        leeway: 30
      },
      theme: {
        logo: 'https://s3-ap-southeast-2.amazonaws.com/danau.demo/logo.png',
      },
    });
  }

}
