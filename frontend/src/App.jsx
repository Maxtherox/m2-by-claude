import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CharacterSelectPage from './pages/CharacterSelectPage';
import CharacterCreatePage from './pages/CharacterCreatePage';
import GamePage from './pages/GamePage';

function ProtectedGameRoute() {
  const character = useSelector((state) => state.character.data);
  if (!character) {
    return <Navigate to="/" replace />;
  }
  return <GamePage />;
}

export default function App() {
  return (
    <div className="w-screen h-screen bg-metin-dark text-gray-200 font-medieval overflow-hidden">
      <Routes>
        <Route path="/" element={<CharacterSelectPage />} />
        <Route path="/create" element={<CharacterCreatePage />} />
        <Route path="/game" element={<ProtectedGameRoute />} />
      </Routes>
    </div>
  );
}
