'use client'
import React, { createContext, useContext, useState, useEffect } from "react";

// Création du contexte pour les données de la ville
const CityDataContext = createContext();

// Hook personnalisé pour utiliser les données de la ville
export const useCityData = () => useContext(CityDataContext);

export const CityDataProvider = ({ children }) => {
  const [randomCity, setRandomCity] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const [cityDataMap, setCityDataMap] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const prefsResponse = await fetch("/prefsSousPrefs.json");
        if (!prefsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const prefsData = await prefsResponse.json();
        setJsonData(prefsData);

        const citiesResponse = await fetch("/cities.json");
        if (!citiesResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const citiesData = await citiesResponse.json();
        const cityMap = new Map(
          citiesData.cities.map((city) => [city.insee_code, city])
        );
        setCityDataMap(cityMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (jsonData && cityDataMap && cityDataMap.size > 0) {
      const randomIndex = Math.floor(Math.random() * jsonData.length);
      const randomCityData = jsonData[randomIndex];
      const additionalData = cityDataMap.get(randomCityData.insee_commune);
      setRandomCity({ ...randomCityData, additionalData });
    }
  }, [jsonData, cityDataMap]);

  return (
    <CityDataContext.Provider value={{ randomCity, cityDataMap, jsonData }}>
      {children}
    </CityDataContext.Provider>
  );
};
