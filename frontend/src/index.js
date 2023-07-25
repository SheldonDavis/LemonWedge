import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import './styles/index.css';
import App from './components/App';
import {disableReactDevTools} from '@fvilers/disable-react-devtools'
import { AuthProvider } from './context/AuthProvider';

if(process.env.NODE_ENV === 'production'){
  disableReactDevTools()
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);

