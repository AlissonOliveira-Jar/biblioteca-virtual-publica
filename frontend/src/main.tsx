import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider.tsx';
import { Toaster } from 'react-hot-toast';
import './style.css';
import App from './App.tsx';

import { FavoritesProvider } from './hooks/useFavoritesCount.tsx'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <App />
        </FavoritesProvider>
        
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
