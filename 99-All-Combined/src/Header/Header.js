import React, {Component} from 'react';
import {Navbar, Button, DropdownButton, MenuItem} from 'react-bootstrap';

class Header extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  render() {
    const auth = this.props.auth;

    const logoutButtons = (
      <DropdownButton className="btn-margin" title="Logout" id="bg-nested-dropdown" bsStyle="primary">
        <MenuItem onClick={auth.logout.bind(this)}>Local Logout</MenuItem>
        <MenuItem onClick={auth.logoutSLO.bind(this)}>SSO Logout</MenuItem>
      </DropdownButton>
    );

    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Auth0 - React</a>
            </Navbar.Brand>
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={this.goTo.bind(this, '')}
            >
              Home
            </Button>
            {
              !auth.isAuthenticated() && (
                <Button
                  bsStyle="primary"
                  className="btn-margin"
                  onClick={this.goTo.bind(this, '')}
                >
                  Login
                </Button>

              )
            }
            {
              auth.isAuthenticated() && (
                <Button
                  bsStyle="primary"
                  className="btn-margin"
                  onClick={this.goTo.bind(this, 'profile')}
                >
                  Profile
                </Button>
              )
            }
            {
              auth.isAuthenticated() && (
                <Button
                  bsStyle="primary"
                  className="btn-margin"
                  onClick={this.goTo.bind(this, 'api')}
                >
                  API
                </Button>
              )
            }
            {
              auth.isAuthenticated() && auth.userHasScopes(['write:messages']) && (
                <Button
                  bsStyle="primary"
                  className="btn-margin"
                  onClick={this.goTo.bind(this, 'admin')}
                >
                  Admin
                </Button>
              )
            }
            {
              auth.isAuthenticated() && logoutButtons
            }
          </Navbar.Header>
        </Navbar>
      </div>
    );
  }
}

export default Header;
