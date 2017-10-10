import jwtDecode from 'jwt-decode';
import Auth0Lock from 'auth0-lock';
import auth0 from 'auth0-js';
import history from '../history';
import {AUTH_CONFIG} from './auth0-variables';

class Auth {
  userProfile;

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.userHasScopes = this.userHasScopes.bind(this);
    this.getToken = this.getToken.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.logoutSLO = this.logoutSLO.bind(this);
    this.loginLock = this.loginLock.bind(this);

    // Init with scopes last set from localStorage or default from auth config
    this.setScopes(this.getScopes());
  }

  login(options) {
    this.auth0.authorize(options || {});
  }

  loginLock() {
    this.auth0Lock.show();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        this.setSession(authResult);
        history.replace('/');
      } else if (err) {
        history.replace('/');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    // If there is a value on the `scope` param from the authResult,
    // use it to set scopes in the session for the user. Otherwise
    // use the scopes as requested. If no scopes were requested,
    // set it to nothing
    const scopes = authResult.scope || this.getScopes() || '';

    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('scopes', JSON.stringify(scopes));
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

  getProfile(cb) {
    let accessToken = this.getToken('access_token');
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('scopes');
    this.userProfile = null;
    // navigate to the home route
    history.replace('/');
  }

  logoutSLO() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('scopes');
    this.userProfile = null;

    // Perform SLO
    this.auth0.logout({returnTo: `${AUTH_CONFIG.appUrl}/logout`});
  }

  renewToken(cb) {
    this.auth0.renewAuth(
      {
        audience: AUTH_CONFIG.audience,
        redirectUri: AUTH_CONFIG.silentAuthRedirect,
        usePostMessage: true,
        postMessageDataType: 'auth0:silent-authentication',
      },
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
      }
    });
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  userHasScopes(scopes) {
    const grantedScopes = JSON.parse(localStorage.getItem('scopes')).split(' ');
    return scopes.every(scope => grantedScopes.includes(scope));
  }

}

export default Auth