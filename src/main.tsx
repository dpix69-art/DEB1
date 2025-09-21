import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import './index.css';

// Страницы
import { Home } from './pages/Home';
import { Level } from './pages/Level';
import { Card } from './pages/Card';

// ВАЖНО: Dictionary — default export
import Dictionary from './pages/Dictionary';

// ВАЖНО: оба — default export (см. файлы ниже)
import DictionaryCategory from './pages/DictionaryCategory';
import DictionaryEntry from './pages/DictionaryEntry';

import { Emails } from './pages/Emails';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/level/:moduleId" element={<Level />} />
        <Route path="/card/:moduleId/:cardId" element={<Card />} />

        {/* Dictionary */}
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/dictionary/bucket/:bucket" element={<DictionaryCategory />} />
        <Route path="/dictionary/entry/:entryId" element={<DictionaryEntry />} />

        <Route path="/emails" element={<Emails />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
