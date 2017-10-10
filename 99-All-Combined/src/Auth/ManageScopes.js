import React, {Component} from "react";
import {FormGroup, FormControl, ControlLabel, Col, Form, HelpBlock} from 'react-bootstrap';

// Changed for Demo

class ManageScope extends Component {

  handleChange(e) {
    this.props.auth.setScopes(e.target.value);
  }

  render() {
    return (
      <div className="container">
        <Form horizontal onSubmit={(e) => e.preventDefault}>
          <FormGroup controlId="scopeForm">
            <Col componentClass={ControlLabel} sm={2}>Request Scopes</Col>
            <Col sm={10}>
              <FormControl name="scope" type="text" defaultValue={this.props.auth.getScopes()}
                           onChange={this.handleChange.bind(this)}/>
              <HelpBlock>Detail <a
                href="https://auth0.com/docs/scopes">https://auth0.com/docs/scopes</a></HelpBlock>
            </Col>
          </FormGroup>
        </Form>
      </div>
    )
  }
}

export default ManageScope;
