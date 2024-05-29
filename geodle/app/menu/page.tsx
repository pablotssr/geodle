'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const router = useRouter();

  const handlePlayPrefecture = () => {
    router.push('/jeu?type=Prefecture');
  };

  const handlePlaySousPrefecture = () => {
    router.push('/jeu?type=SousPrefecture');
  };

  return (
    <div>
      <h2>Choose your game mode</h2>
      <button onClick={handlePlayPrefecture}>Play with Prefecture</button>
      <button onClick={handlePlaySousPrefecture}>Play with Sous-Prefecture</button>
    </div>
  );
}
