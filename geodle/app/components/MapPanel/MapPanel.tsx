"use client";
import { Markers, GameStates, MyMapProps } from "../../lib/definitions";
import { useSearchParams } from "next/navigation";
import {
  iconRed,
  iconOrange,
  iconYellow,
  haversineDistance,
  iconGreen,
} from "../../lib/markers";
import GameResultModal from "../Modal/GameResultModal";
import { useCityData } from "../../context/CityDataContext";
import useDebounce from "../../hooks/useDebounce";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons/faArrowsRotate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import Loader from "../Layout/Loader";
import React, { useState, useRef, useEffect } from "react";
import Hints from "../Hints/Hints";

const MapComponent = dynamic<MyMapProps>(
  () => import("../Map/Map").then((mod) => mod.Map),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

const MapPanel: React.FC = () => {
  const { randomCity, jsonData, generateRandomCity } = useCityData();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [nbTries, setNbTries] = useState<number>(0);
  const [markers, setMarkers] = useState<Markers[]>([]);
  const [guess, setGuess] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameState, setGameState] =
    useState<keyof typeof GameStates>("playing");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debouncedGuess = useDebounce(guess, 500);

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
      const input = inputRef.current;
      if (selectedSuggestionIndex !== -1) {
        event.preventDefault();
        setGuess(suggestions[selectedSuggestionIndex]);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      } else {
        if (input && input.value !== null) {
          event.preventDefault();
          setGuess(input.value);
          handleGuess();
          setShowSuggestions(false);
          input.focus();
        }
      }
    }
  };

  const handleGuess = () => {
    if (gameState === "win")
      toast.warn("You already won! Reset the game by generating a new city.");

    if (gameState === "playing") setNbTries((prevAttempts) => prevAttempts + 1);

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

      const distance = haversineDistance(
        randomCity!.geo_point_2d,
        matchedCityPosition
      );
      let icon = iconGreen;

      if (distance === 0) {
        icon = iconGreen;
      } else if (distance < 100) {
        icon = iconYellow;
      } else if (distance < 300) {
        icon = iconOrange;
      } else {
        icon = iconRed;
      }

      const newMarker: Markers = {
        position: matchedCityPosition,
        nom_commune: matchedCity!.nom_commune,
        icon: icon,
      };

      setMarkers((prevMarkers) =>
        prevMarkers ? [...prevMarkers, newMarker] : [newMarker]
      );
      setGuess("");
    }

    if (
      randomCity &&
      guess.toLowerCase() === randomCity.nom_commune.toLowerCase()
    ) {
      setIsCorrect(true);
      setGameState("win");
    } else {
      setIsCorrect(false);
    }
  };

  const handleGuessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(event.target.value.toLowerCase());
  };

  useEffect(() => {
    if (debouncedGuess.trim() !== "") {
      const filteredSuggestions = jsonData
        ? jsonData
            .filter(
              (city) =>
                city.type === "Préfecture" ||
                city.type === "Préfecture de région" ||
                city.type === "Capitale"
            )
            .map((city) => city.nom_commune.toLowerCase())
            .filter((city) => city.startsWith(debouncedGuess))
        : [];
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedGuess, jsonData, type]);

  const handleSuggestionClick = (suggestion: string, index: number) => {
    setGuess(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleReset = () => {
    setGameState("playing");
    generateRandomCity();
    setGuess("");
    setMarkers([]);
    setNbTries(0);
  };

  return (
    <div className="flex flex-col items-center flex-1 justify-center">
      <h2 className="text-xl">Guess the City</h2>
      {randomCity && randomCity.additionalData && (
        <MapComponent
          position={[
            parseFloat(randomCity.additionalData.latitude),
            parseFloat(randomCity.additionalData.longitude),
          ]}
          zoom={5}
          markers={markers}
        />
      )}
      {randomCity && randomCity.additionalData && (
        <div className="flex flex-col gap-4">
          <div className="my-2 text-center font-semibold">
            Trials: {nbTries}
          </div>

          <Hints randomCity={randomCity} nbTries={nbTries} gamemode="map"/>
        </div>
      )}

      {randomCity && (
        <div className="flex flex-col">
          <div className="flex flex-row mt-4 gap-2">
            <div className="join">
              <input
                className="input input-bordered join-item"
                ref={inputRef}
                type="text"
                value={guess}
                onChange={handleGuessChange}
                onKeyDown={handleKeyDown}
              />
              <button
                className="btn btn-primary join-item"
                onClick={handleGuess}>
                Guess
              </button>
            </div>

            <div className="tooltip" data-tip="Pick a new city">
              <button
                className="border-2 hidden lg:inline-flex items-center justify-center w-12 h-12 bg-orange-500 border-orange-500 text-white rounded"
                onClick={handleReset}>
                <FontAwesomeIcon icon={faArrowsRotate} />
              </button>
            </div>
          </div>

          {isCorrect && <div></div>}

          {showSuggestions && (
            <div
              className="suggestions-container bg-base-200 border-base-200 border-2 rounded-lg"
              ref={suggestionsRef}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`suggestion py-4 px-4  ${
                    selectedSuggestionIndex === index ? "selected bg-black" : ""
                  }`}
                  onClick={() => handleSuggestionClick(suggestion, index)}>
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <GameResultModal gameState={gameState} resetGame={handleReset} />
    </div>
  );
};

export default MapPanel;
