import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/index.css';
import App from './components/App';
import { HashRouter } from 'react-router-dom';
import { initializeApp } from 'firebase/app';

const root = ReactDOM.createRoot(document.getElementById('root'));
const firebaseConfig = {
  apiKey: "AIzaSyD3FEyblcZ_A_0QEic8vzkVtUQaZ9RqAbU",
  authDomain: "photo-tagging-527f9.firebaseapp.com",
  projectId: "photo-tagging-527f9",
  storageBucket: "photo-tagging-527f9.appspot.com",
  messagingSenderId: "1013274305515",
  appId: "1:1013274305515:web:7bc6ac10f9d724b35bafae"
};

initializeApp(firebaseConfig)
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

