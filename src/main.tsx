import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Dictionary } from './pages/Dictionary';
import { Emails } from './pages/Emails';
import App from './App.tsx';
import './index.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/level/:moduleId" element={<Level />} />
  <Route path="/card/:moduleId/:cardId" element={<Card />} />
  <Route path="/dictionary" element={<Dictionary />} />
  <Route path="/emails" element={<Emails />} />
</Routes>