'use client';
import { createContext, useContext, useState, useEffect } from "react";
import { City, CityDataContextType, CityDataProviderProps } from "../lib/definitions";

const CityDataContext = createContext<CityDataContextType | undefined>(undefined);

export const useCityData = (): CityDataContextType => {
  const context = useContext(CityDataContext);
  if (!context) {
    throw new Error("useCityData must be used within a CityDataProvider");
  }
  return context;
};

export const CityDataProvider = ({ children }: CityDataProviderProps): JSX.Element => {
  const [randomCity, setRandomCity] = useState<City | null>(null);
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [cityDataMap, setCityDataMap] = useState<Map<string, City> | null>(null);

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
        const cityMap = new Map<string, City>(
          citiesData.cities.map((city: City) => [city.insee_commune, city])
        );
        setCityDataMap(cityMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (jsonData.length > 0 && cityDataMap && cityDataMap.size > 0) {
      generateRandomCity();
    }
  }, [jsonData, cityDataMap]);

  const generateRandomCity = () => {
    if (jsonData.length > 0 && cityDataMap && cityDataMap.size > 0) {
      const randomIndex = Math.floor(Math.random() * jsonData.length);
      const randomCityData = jsonData[randomIndex];
      const additionalData = cityDataMap.get(randomCityData.insee_commune);
      setRandomCity({ ...randomCityData, additionalData });
    }
  };

  const contextValue: CityDataContextType = {
    randomCity,
    cityDataMap,
    jsonData,
    generateRandomCity
  };

  return (
    <CityDataContext.Provider value={contextValue}>
      {children}
    </CityDataContext.Provider>
  );
};
