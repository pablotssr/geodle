'use client';
import React, { useEffect, useState } from 'react';
import { City } from '../types';

export default function Jeu() {
  const [jsonData, setJsonData] = useState<City[] | null>(null);
  const [randomCity, setRandomCity] = useState<City | null>(null);
  const [guess, setGuess] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/cities.json');
      const data = await response.json();
      setJsonData(data.cities);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (jsonData) {
      const randomIndex = Math.floor(Math.random() * jsonData.length);
      const randomCityData = jsonData[randomIndex];
      setRandomCity(randomCityData);
    }
  }, [jsonData]);

  const handleGuess = () => {
    if (randomCity && guess.toLowerCase() === randomCity.city_code.toLowerCase()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleGuessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(event.target.value);
  };

  return (
    <div>
      <h2>Guess the City</h2>
      {randomCity && (
        <div>
          <p>Guess the city: {randomCity.city_code}</p>
          <input
            type="text"
            value={guess}
            onChange={handleGuessChange}
          />
          <button onClick={handleGuess}>Check</button>
          {isCorrect !== null && (
            <p>{isCorrect ? 'Yes, that\'s correct!' : 'No, try again.'}</p>
          )}
        </div>
      )}
    </div>
  );
}
