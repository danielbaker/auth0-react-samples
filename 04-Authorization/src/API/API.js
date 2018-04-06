import React, {Component} from 'react';
import {API_URL} from './../constants';
import ReactJson from 'react-json-view'
import ManageScopes from '../Auth/ManageScopes';
import {Panel, Button, ButtonGroup} from 'react-bootstrap';
import moment from 'moment-timezone';
import axios from 'axios';
import './API.css';


class API extends Component {
  componentWillMount() {
    this.setState({
      accessToken: this.props.auth.decodeToken('access_token'),
      response: {}
    });
    this.getToken = this.getToken.bind(this);
    this.getToken();
  }

  formatResponse(rsp, err) {
    if (err) {
      const response = err.response || {data: {}};
      this.setState({
        response: {
          message: err.message,
          status: response.status,
          statusText: response.statusText,
          data: response.data
        }
      })
    } else {
      this.setState({
        response: {
          status: rsp.status,
          statusText: rsp.statusText,
          data: rsp.data
        }
      })
    }
  }

  getToken() {
    this.props.auth.getProfile((err, profile) => {
      this.setState({accessToken: this.props.auth.decodeToken('access_token')});
    });
  }

  renewToken() {
    this.props.auth.renewToken(() => {
      this.getToken()
    });
  }

  getExpiryDate() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const date = moment.tz(new Date(expiresAt), moment.tz.guess());
    return `${date.format()} (${date.fromNow()})`;
  }

  getAPI(url) {
    const headers = {'Authorization': `Bearer ${this.props.auth.getToken('access_token')}`};
    axios.get(`${API_URL}/${url}`, {headers})
      .then(response => this.formatResponse(response))
      .catch(error => this.formatResponse(null, error));
  }

  render() {
    const {accessToken, response} = this.state;

    return (
      <div className="container">
        <h1 className="center">API Authorization</h1>
        <ManageScopes auth={this.props.auth}/>
        <div className="token-area">
          <h4>Access Token</h4>
          <Panel header="Used to call API's">
            <p>
              Your <code>access_token</code> has an expiry date of:{' '}
              {this.getExpiryDate()}
            </p>
            <ButtonGroup>
              <Button type="button" bsStyle="primary" onClick={this.renewToken.bind(this)} style={{marginBottom: '10px'}}>Renew
                Token</Button>
            </ButtonGroup>
            <ReactJson theme="flat" src={accessToken} displayDataTypes={false} collapsed={3}/>
          </Panel>
        </div>
        <div>
          <h1 className="center">Make an API Call to the Server</h1>
          <Button bsStyle="primary" className="btn-margin" onClick={this.getAPI.bind(this, 'public')}>Ping</Button>
          <Button bsStyle="primary" className="btn-margin" onClick={this.getAPI.bind(this, 'private')}>Call
            Private</Button>
        </div>
        <div className="token-area">
          <h4>Result</h4>
          <ReactJson theme="flat" src={response} displayDataTypes={false} collapsed={3}/>
        </div>
      </div>
    );
  }
}

export default API;
