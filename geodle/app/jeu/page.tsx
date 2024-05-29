'use client';
import React, { useEffect, useState } from 'react';

interface City {
  gid: string;
  nom_commune: string;
  insee_commune: string;
  type: string;
  additionalData?: CityAdditionalData;
}

interface CityAdditionalData {
  insee_code: string;
  city_code: string;
  zip_code: string;
  label: string;
  latitude: string;
  longitude: string;
  department_name: string;
  department_number: string;
  region_name: string;
  region_geojson_name: string;
}

export default function ExamplePage() {
  const [jsonData, setJsonData] = useState<City[] | null>(null);
  const [cityDataMap, setCityDataMap] = useState<Map<string, CityAdditionalData>>(new Map());
  const [randomCity, setRandomCity] = useState<City | null>(null);
  const [guess, setGuess] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/prefsSousPrefs.json');
      const data = await response.json();
      setJsonData(data);
    }

    async function fetchCities() {
      const response = await fetch('/cities.json');
      const data = await response.json();
      const cityMap: Map<string, CityAdditionalData> = new Map(data.cities.map((city: CityAdditionalData) => [city.insee_code, city]));
      setCityDataMap(cityMap);
    }

    fetchData();
    fetchCities();
  }, []);

  useEffect(() => {
    if (jsonData && cityDataMap.size > 0) {
      const randomIndex = Math.floor(Math.random() * jsonData.length);
      const randomCityData = jsonData[randomIndex];
      const additionalData = cityDataMap.get(randomCityData.insee_commune);
      setRandomCity({ ...randomCityData, additionalData });
    }
  }, [jsonData, cityDataMap]);

  const handleGuess = () => {
    if (randomCity && guess.toLowerCase() === randomCity.nom_commune.toLowerCase()) {
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
          <p>Ville: {randomCity.nom_commune}</p>
          {randomCity.additionalData && (
            <div>
              <p>Code Postal: {randomCity.additionalData.zip_code}</p>
              <p>Type: {randomCity.type}</p>
              <p>Nom departement: {randomCity.additionalData.department_name}</p>
              <p>n° departement: {randomCity.additionalData.department_number}</p>
              <p>Région: {randomCity.additionalData.region_geojson_name}</p>
            </div>
          )}
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
