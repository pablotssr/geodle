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
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Choose your game mode</h2>
      <button
        className="btn btn-primary btn-lg w-full"
        onClick={handlePlayPrefecture}
      >
        Play with Prefecture
      </button>
      <button
        className="btn btn-primary btn-lg w-full"
        onClick={handlePlaySousPrefecture}
      >
        Play with Sous-Prefecture
      </button>
    </div>
  );
}
