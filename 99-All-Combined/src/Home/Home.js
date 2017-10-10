import React, {Component} from "react";
import {Button} from 'react-bootstrap';
import {AUTH_CONFIG} from '../Auth/auth0-variables';
import ManageScopes from '../Auth/ManageScopes';
import "./Home.css"

// Changed for Demo

class Home extends Component {

  goTo(route) {
    this.props.history.replace(`/${route}`);
    this.state = {
      scopes: AUTH_CONFIG.scopes
    }
  }

  pwdless() {
    this.props.auth.login({pwdless: 'link'});
  }

  login() {
    this.props.auth.login();
  }

  silentAuth() {
    this.props.auth.renewToken(() => {
      this.props.history.replace('/profile')
    });
  }

  render() {
    const auth = this.props.auth;

    return (
      <div className="container">
        {
          auth.isAuthenticated() && (
            <h4>
              You are logged in!
            </h4>
          )
        }
        {
          !auth.isAuthenticated() && (
            <div>
              <h1 className="center">
                You are not logged in!
              </h1>
              <div className="center">
                Multiple methods supported <a href="https://auth0.com/docs/libraries/auth0js/v8">https://auth0.com/docs/libraries/auth0js/v8</a>
              </div>

              <div>
                <ManageScopes auth={this.props.auth}/>
              </div>

              <div className="login-option">
                <h4>Centralised Login (Auth0 Hosted Page)</h4>
                <Button type="button" bsStyle="primary" onClick={this.login.bind(this)}>Hosted Login</Button>
                <span><a href={"https://auth0.com/docs/hosted-pages/login#about-the-hosted-login-page"}>https://auth0.com/docs/hosted-pages/login#about-the-hosted-login-page</a></span>
              </div>

              <div className="login-option">
                <h4>Passwordless Login</h4>
                <Button type="button" bsStyle="primary" onClick={this.pwdless.bind(this)}>Passwordless Login</Button>
                <span><a href={"https://auth0.com/passwordless"}>https://auth0.com/passwordless</a></span>
              </div>

              <div className="login-option">
                <h4>Auth0 Lock Embedded Login</h4>
                <Button type="button" bsStyle="primary" onClick={auth.loginLock.bind(this)}>Lock Login</Button>
                <span><a href={"https://auth0.com/docs/libraries/lock/v10#3-showing-lock"}>https://auth0.com/docs/libraries/lock/v10#3-showing-lock</a></span>
              </div>

              <div className="login-option">
                <h4>Custom Login Page via Auth0 API</h4>
                <Button type="button" bsStyle="primary" onClick={this.goTo.bind(this, 'login')}>Custom Login</Button>
                <span><a
                  href={"https://auth0.com/docs/api/authentication"}>https://auth0.com/docs/api/authentication</a></span>
              </div>

              <div className="login-option">
                <h4>SSO Silent Auth (Refresh Access Token)</h4>
                <Button type="button" bsStyle="primary" onClick={this.silentAuth.bind(this)}>Silent SSO</Button>
                <span><a href={"https://auth0.com/docs/libraries/auth0js/v8#using-renewauth-to-acquire-new-tokens"}>https://auth0.com/docs/libraries/auth0js/v8#using-renewauth-to-acquire-new-tokens</a></span>
              </div>

            </div>
          )
        }
      </div>
    );
  }
}

export default Home;
