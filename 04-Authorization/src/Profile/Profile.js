import React, {Component} from 'react';
import ReactJson from 'react-json-view'
import {Panel, ControlLabel, Glyphicon} from 'react-bootstrap';
import './Profile.css';

class Profile extends Component {
  componentWillMount() {
    this.setState({
      profile: this.props.auth.userProfile || {},
      id_token: this.props.auth.decodeToken('id_token')
    });

    this.props.auth.getProfile((err, profile) => {
      this.setState({profile});
    });
  }

  render() {
    const {profile, id_token} = this.state;

    return (
      <div className="container">
        <div className="profile-area">
          <h2>JWT ID Token / Profile ({profile.name})</h2>
          <Panel header="Profile information pulled from the ID Token. Restricted to claims granted to this application">
            <img src={profile.picture} alt="profile"/>
            <div>
              <ControlLabel><Glyphicon glyph="user"/> Nickname:</ControlLabel>
              <h3>{profile.nickname}</h3>
            </div>
          <Panel header="">
            <ReactJson theme="flat" src={id_token} displayDataTypes={false} collapsed={3}/>
          </Panel>
          </Panel>
        </div>
      </div>
    );
  }
}

export default Profile;
