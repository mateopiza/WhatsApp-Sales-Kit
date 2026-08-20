import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Service Worker Registration for PWA support
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Empires PWA ServiceWorker registered with scope:', registration.scope);
      })
      .catch((err) => {
        console.warn('Empires PWA ServiceWorker registration failed:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
