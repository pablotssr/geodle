"use client";
import React, { useEffect, useState } from "react";
import MyMap from "../components/map";
import { CityAdditionalData, City, Markers } from "../lib/definitions";

export default function ExamplePage() {
  const [markers, setMarkers] = useState<Markers[] | null>(null);

  const [jsonData, setJsonData] = useState<City[] | null>(null);
  const [cityDataMap, setCityDataMap] = useState<
    Map<string, CityAdditionalData>
  >(new Map());
  const [randomCity, setRandomCity] = useState<City | null>(null);
  const [guess, setGuess] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/prefsSousPrefs.json");
      const data = await response.json();
      setJsonData(data);
    }

    async function fetchCities() {
      const response = await fetch("/cities.json");
      const data = await response.json();
      const cityMap: Map<string, CityAdditionalData> = new Map(
        data.cities.map((city: CityAdditionalData) => [city.insee_code, city])
      );
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
      if (randomCityData && additionalData) {
        const newMarker: Markers = {
          position: [
            parseFloat(additionalData.latitude),
            parseFloat(additionalData.longitude),
          ],
          nom_commune: randomCityData.nom_commune,
        };

        setMarkers([newMarker]);
      }
    }
  }, [jsonData, cityDataMap]);

  const handleGuess = () => {
    if (
      randomCity &&
      guess.toLowerCase() === randomCity.nom_commune.toLowerCase()
    ) {
      setIsCorrect(true);
      const newMarker: Markers = {
        position: [
          parseFloat(randomCity.additionalData!.latitude),
          parseFloat(randomCity.additionalData!.longitude),
        ],
        nom_commune: randomCity.nom_commune,
      };

      setMarkers((prevMarkers) =>
        prevMarkers ? [...prevMarkers, newMarker] : [newMarker]
      );
    } else {
      setIsCorrect(false);
    }
  };

  const handleGuessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(event.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl">Guess the City</h2>
      {randomCity && (
        <div className="mb-10">
          <p>Ville: {randomCity.nom_commune}</p>
          {randomCity.additionalData && (
            <div>
              <p>Code Postal: {randomCity.additionalData.zip_code}</p>
              <p>Type: {randomCity.type}</p>
              <p>
                Nom departement: {randomCity.additionalData.department_name}
              </p>
              <p>
                n° departement: {randomCity.additionalData.department_number}
              </p>
              <p>Région: {randomCity.additionalData.region_geojson_name}</p>
            </div>
          )}
          <input type="text" value={guess} onChange={handleGuessChange} />
          <button onClick={handleGuess}>Check</button>
          {isCorrect !== null && (
            <p>{isCorrect ? "Yes, that's correct!" : "No, try again."}</p>
          )}
        </div>
      )}

      {randomCity && randomCity.additionalData && (
        <MyMap
          position={[
            parseFloat(randomCity.additionalData.latitude),
            parseFloat(randomCity.additionalData.longitude),
          ]}
          zoom={5}
          markers={markers!}
        />
      )}
    </div>
  );
}
