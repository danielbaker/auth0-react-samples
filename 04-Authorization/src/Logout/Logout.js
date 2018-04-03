import React, { Component } from 'react';

class Logout extends Component {
  render() {
    const auth = this.props.auth;

    return (
      <div className="container">
        {
          auth.isAuthenticated() && (
              <h4>
                Weird you are still logged in, did you actually logout?
              </h4>
            )
        }
        {
          !auth.isAuthenticated() && (
              <h4>
                You were logged out of all applications (SLO)
              </h4>
            )
        }
      </div>
    );
  }
}

export default Logout;
