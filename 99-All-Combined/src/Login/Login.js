import React, {Component} from "react";
import {FormGroup, FormControl, ControlLabel, Button, Col, Form} from 'react-bootstrap';
import {AUTH_CONFIG} from '../Auth/auth0-variables';

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      username: '',
      password: ''
    }
  }

  handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  login(e) {
    e.preventDefault();
    const {auth} = this.props;

    auth.auth0.client.login({
      realm: 'Username-Password-Authentication',
      username: this.state.username,
      password: this.state.password,
      scope: 'openid profile',
      audience: AUTH_CONFIG.audience
    }, function (err, authResult) {
      if (err) {
        console.log(err);
        alert(`${err.code}: ${err.description}`);
      }
      if (authResult) {
        auth.setSession(authResult);
        console.log(authResult);
      }
    });
  }

  render() {
    const auth = this.props.auth;
    return (
      <div className="container">
        {
          auth.isAuthenticated() && (
            <h4>
              You are already logged in!
            </h4>
          )
        }
        {
          !auth.isAuthenticated() && (
            <div>
              <Col sm={6}>
                <h2>Username/Password Authentication</h2>
                <Form horizontal onSubmit={this.login}>
                  <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} sm={2}>Email</Col>
                    <Col sm={10}>
                      <FormControl name="username" type="email" placeholder="Email" onChange={this.handleChange}/>
                    </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalPassword">
                    <Col componentClass={ControlLabel} sm={2}>Password</Col>
                    <Col sm={10}>
                      <FormControl name="password" type="password" placeholder="Password" onChange={this.handleChange}/>
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col smOffset={2} sm={10}>
                      <Button type="submit" bsStyle="primary" className='btn-margin'>Log In</Button>
                      <Button type="submit" bsStyle="primary" className='btn-margin'>Sign Up</Button>
                    </Col>
                  </FormGroup>
                </Form>
              </Col>
              <Col sm={6}>
                <h2>Social Authentication</h2>
                <Button type="submit" bsStyle="danger" className='btn-margin'>Log In with Google</Button>
              </Col>
            </div>
          )
        }
      </div>
    );
  }
}

export default Login;
