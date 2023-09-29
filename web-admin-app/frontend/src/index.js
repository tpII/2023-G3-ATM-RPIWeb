import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

import './index.css';
import App from './App';

// Base url
const miApi = axios.create({
  baseURL: "http://127.0.0.1:2000/api",
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Renderizado del componente root: App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default miApi