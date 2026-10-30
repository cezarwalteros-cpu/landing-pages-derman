import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { TextosProvider } from './lib/textos';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TextosProvider>
      <App />
    </TextosProvider>
  </StrictMode>,
);
