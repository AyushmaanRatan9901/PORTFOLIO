import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ProfileProvider } from './context/ProfileContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <ProfileProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProfileProvider>
  </ThemeProvider>
);

