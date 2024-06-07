'use client';
import React from 'react';
import Link from 'next/link';

export default function MenuPage() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl text-center font-bold">Choose your game mode</h2>
      <Link
        className="btn btn-primary btn-lg text-white w-full"
        href="/word"
      >
        Word the city 
      </Link>
      <Link
        className="btn btn-secondary btn-lg text-white w-full"
        href="/map"
      >
        Map the city
      </Link>
    </div>
  );
}
