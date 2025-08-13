// Entry point for the React application
import React from 'react';
import { createRoot } from 'react-dom/client';
import QuotationApp from './components/QuotationApp';
import './styles/index.css'; // Import global styles

// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Check if the root element exists
if (rootElement) {
  const root = createRoot(rootElement);

  // Render the React application
  root.render(
    <React.StrictMode>
      <QuotationApp />
    </React.StrictMode>
  );
} else {
  // Log an error if the root element is not found
  if (process.env.NODE_ENV === 'development') {
    console.error('Root element not found. Ensure there is a <div id="root"></div> in your HTML.');
  }
}
