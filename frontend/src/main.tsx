import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './css/style.css'; // Primary styles
import './css/admin.css'; // Admin dashboard styles
import './css/portfolio.css'; // Portfolio sections
import './css/footer.css'; // Footer styles

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
