import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from "react-dom/client"
import App from './App.jsx';
import { CssBaseline } from '@mui/material';

createRoot(document.getElementById('root')).render(
  <>
    <CssBaseline />
    <App />
  </>
);
