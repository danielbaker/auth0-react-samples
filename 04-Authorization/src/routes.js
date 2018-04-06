import React from 'react';
import {Redirect, Route, Router} from 'react-router-dom';
import Auth from './Auth/AuthCustom';
import App from './App';
import Header from './Header/Header';
import Home from './Home/Home';
import Login from './CustomLogin/CustomLogin';
import Profile from './Profile/Profile';
import API from './API/API';
import Admin from './Admin/Admin';
import Callback from './Callback/Callback';
import history from './history';
import Logout from './Logout/Logout';

const auth = new Auth();

const handleAuthentication = (nextState) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

export default () => {
  return (
    <Router history={history} component={App}>
      <div>
        <Header auth={auth} history={history}/>
        <Route path="/" exact={true} render={(props) => <Home history={history} auth={auth} {...props} />}/>
        <Route path="/login" render={(props) => <Login auth={auth} history={history} {...props} />}/>
        <Route path="/profile" render={(props) => (
          !auth.isAuthenticated() ? (
            <Redirect to="/"/>
          ) : (
            <Profile auth={auth} {...props} />
          )
        )}/>
        <Route path="/api" render={(props) => (
          !auth.isAuthenticated() ? (
            <Redirect to="/"/>
          ) : (
            <API auth={auth} {...props} />
          )
        )}/>
        <Route path="/admin" render={(props) => (
          !auth.isAuthenticated() || !auth.userHasScopes(['admin']) ? (
            <Redirect to="/"/>
          ) : (
            <Admin auth={auth} {...props} />
          )
        )}/>
        <Route path="/callback" render={(props) => {
          handleAuthentication(props);
          return <Callback {...props} />
        }}/>

        <Route path="/logout" render={(props) => <Logout auth={auth} {...props} />}/>

      </div>
    </Router>
  );
}
