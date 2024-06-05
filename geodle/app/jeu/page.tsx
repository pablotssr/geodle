"use client";
import React, { useEffect, useState, useRef } from "react";
import MyMap from "../components/Map/index";
import { CityAdditionalData, City, Markers } from "../lib/definitions";
import { useRouter, useSearchParams } from "next/navigation";
import GamePanel from "../components/GamePanel";
import {
  greenIcon,
  iconRed,
  iconBlue,
  iconYellow,
  haversineDistance,
} from "../lib/markers";

export default function Jeu() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [markers, setMarkers] = useState<Markers[] | null>(null);
  const [jsonData, setJsonData] = useState<City[] | null>(null);
  const [cityDataMap, setCityDataMap] = useState<
    Map<string, CityAdditionalData>
  >(new Map());
  const [randomCity, setRandomCity] = useState<City | null>(null);
  const [guess, setGuess] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("prefsSousPrefs.json");
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error("Error fetching prefsSousPrefs.json:", error);
      }
      
      try {
        const response = await fetch("cities.json");
        const data = await response.json();
        const cityMap: Map<string, CityAdditionalData> = new Map(
          data.cities.map((city: CityAdditionalData) => [city.insee_code, city])
        );
        setCityDataMap(cityMap);
      } catch (error) {
        console.error("Error fetching cities.json:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
        setGuess((prevValue) => prevValue + event.key);
      } else if (event.key === "Backspace") {
        setGuess((prevValue) => prevValue.slice(0, -1));
      } else if (event.key === "Enter") {
        handleGuess();
      }
      console.log(guess);
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [guess]);

  useEffect(() => {
    if (jsonData && cityDataMap.size > 0) {
      let filteredCities = jsonData;
      if (type === "Prefecture") {
        filteredCities = jsonData.filter((city) => city.type === "Préfecture" || city.type === "Préfecture de région");
      } else if (type === "SousPrefecture") {
        filteredCities = jsonData.filter(
          (city) => city.type === "Sous-préfecture"
        );
      }
      const randomIndex = Math.floor(Math.random() * filteredCities.length);
      const randomCityData = filteredCities[randomIndex];
      const additionalData = cityDataMap.get(randomCityData.insee_commune);
      setRandomCity({ ...randomCityData, additionalData });
      if (randomCityData && additionalData) {
        const newMarker: Markers = {
          position: [
            parseFloat(additionalData.latitude),
            parseFloat(additionalData.longitude),
          ],
          nom_commune: randomCityData.nom_commune,
          icon: greenIcon,
        };

        setMarkers([newMarker]);
      }
    }
  }, [jsonData, cityDataMap, type]);

  const handleGuess = () => {
    console.log(guess);
    //CHECK SI GUESS EST UN NOM DE VILLE VALIDE
    const isCityMatched =
      jsonData &&
      jsonData.some(
        (city) => city.nom_commune.toLowerCase() === guess.toLowerCase()
      );
    if (isCityMatched) {
      const matchedCity = jsonData!.find(
        (city) => city.nom_commune.toLowerCase() === guess.toLowerCase()
      );

      const matchedCityPosition: [number, number] = [
        parseFloat(matchedCity!.geo_point_2d.lat),
        parseFloat(matchedCity!.geo_point_2d.lon),
      ];

      console.log(randomCity?.geo_point_2d);
      console.log(matchedCityPosition);
      const distance = haversineDistance(
        randomCity!.geo_point_2d,
        matchedCityPosition
      );
      let icon = iconBlue;

      // Définir des seuils pour changer les couleurs
      if (distance < 100) {
        icon = iconRed; // Très proche
      } else if (distance < 400) {
        icon = iconYellow; // Moyennement proche
      } else {
        icon = iconBlue;
      }

      const newMarker: Markers = {
        position: matchedCityPosition,
        nom_commune: matchedCity!.nom_commune,
        icon: icon,
      };

      setMarkers((prevMarkers) =>
        prevMarkers ? [...prevMarkers, newMarker] : [newMarker]
      );
    }

    //RESULTAT
    if (
      randomCity &&
      guess.toLowerCase() === randomCity.nom_commune.toLowerCase()
    ) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleGuessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setGuess(value);
    if (value.trim() !== "") {
      const filteredSuggestions = jsonData
        ? jsonData
            .filter((city) => {
              if (type === "Prefecture") {
                return city.type === "Préfecture" || city.type === "Préfecture de région";
              } else if (type === "SousPrefecture") {
                return city.type === "Sous-préfecture";
              }
              return false;
            })
            .map((city) => city.nom_commune.toLowerCase())
            .filter((city) => city.startsWith(value))
        : [];
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1); // Reset selected suggestion index when input value changes
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (event.key === "Enter") {
      console.log("guess");
      const input = inputRef.current;
      if (input && input.value !== null) {
        event.preventDefault();
        setGuess(input.value);
        handleGuess();
        setShowSuggestions(false);
        input.focus();
      }
    } else if (event.key === "Enter" && selectedSuggestionIndex !== -1) {
      event.preventDefault();
      setGuess(suggestions[selectedSuggestionIndex]);
      setShowSuggestions(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleSuggestionClick = (suggestion: string, index: number) => {
    setGuess(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1); // Reset selected suggestion index
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl">Guess the City</h2>
      {randomCity && (
        <div>
          <GamePanel randomCity={randomCity.nom_commune} />

          <p>City: {randomCity.nom_commune}</p>
          <p>Code Insee: {randomCity.insee_commune}</p>
          {randomCity.type === "Sous-préfecture" &&
            randomCity.additionalData && (
              <p>Department: {randomCity.additionalData.department_number}</p>
            )}
          {randomCity.additionalData && (
            <div>
              <p>City Code: {randomCity.additionalData.city_code}</p>
              <p>Zip Code: {randomCity.additionalData.zip_code}</p>
              <p>Department: {randomCity.additionalData.department_name}</p>
              <p>Region: {randomCity.additionalData.region_name}</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={handleGuessChange}
            onKeyDown={handleKeyDown} // Add keydown event listener
          />
          <button onClick={handleGuess}>Check</button>
          {isCorrect !== null && (
            <p>{isCorrect ? "Yes, that's correct!" : "No, try again."}</p>
          )}
          {showSuggestions && (
            <div className="suggestions-container" ref={suggestionsRef}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`suggestion ${
                    selectedSuggestionIndex === index ? "selected" : ""
                  }`}
                  onClick={() => handleSuggestionClick(suggestion, index)}>
                  {suggestion}
                </div>
              ))}
            </div>
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
