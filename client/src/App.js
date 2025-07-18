import React from 'react';
import './App.css';
import  { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemoryAlbum from './pages/MemoryAlbum';
import HomePage from './pages/HomePage';
import MemoryDiary from './pages/MemoryDiary';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/memories" element={<MemoryAlbum />} />
        <Route path="/diary" element={<MemoryDiary />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;