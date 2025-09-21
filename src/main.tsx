import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import './index.css';

// Страницы
import { Home } from './pages/Home';
import { Level } from './pages/Level';
import { Card } from './pages/Card';
import  Dictionary  from './pages/Dictionary';
import { DictionaryCategory } from './pages/DictionaryCategory';
import { DictionaryEntry } from './pages/DictionaryEntry';
import { Emails } from './pages/Emails';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/level/:moduleId" element={<Level />} />
        <Route path="/card/:moduleId/:cardId" element={<Card />} />

        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/dictionary/category/:bucket" element={<DictionaryCategory />} />
        <Route path="/dictionary/:entryId" element={<DictionaryEntry />} />

        <Route path="/emails" element={<Emails />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
