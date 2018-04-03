import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';
import {BrowserRouter} from 'react-router-dom'

import './index.css'
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
  document.getElementById('root')
);
