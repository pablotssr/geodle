"use client";

import { useState, useRef } from "react";
import {
	Markers,
	GameStates,
} from "../../lib/definitions";
import { useSearchParams } from "next/navigation";
import {
	greenIcon,
	iconRed,
	iconBlue,
	iconYellow,
	haversineDistance,
} from "../../lib/markers";
import GameResultModal from "../Modal/GameResultModal";
import dynamic from "next/dynamic";
import Loader from "../Layout/loader";
import { useCityData } from "../../context/CityDataContext";
const MyMap = dynamic(() => import("../Map/"), {
	loading: () => <Loader />,
	ssr: false,
});

export default function MapPanel() {
  const { randomCity, jsonData, generateRandomCity } = useCityData()
  const searchParams = useSearchParams();
	const type = searchParams.get("type");
	const [nbTries, setNbTries] = useState<number>(0);
	const [indice, setIndice] = useState<string | null>(null);
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

	const handleIndiceClick = (value: string) => {
		setIndice(value);
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
		} else if (event.key === "Enter" && selectedSuggestionIndex !== -1) {
			event.preventDefault();
			setGuess(suggestions[selectedSuggestionIndex]);
			setShowSuggestions(false);
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}
	};

	const handleGuess = () => {
		setNbTries((prevAttempts) => prevAttempts + 1);
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
			let icon = iconBlue;

			if (distance < 100) {
				icon = iconRed;
			} else if (distance < 400) {
				icon = iconYellow;
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
		const value = event.target.value.toLowerCase();
		setGuess(value);
		if (value.trim() !== "") {
			const filteredSuggestions = jsonData
				? jsonData
						.filter((city) => {
							if (type === "Prefecture") {
								return (
									city.type === "Préfecture" ||
									city.type === "Préfecture de région"
								);
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
			setSelectedSuggestionIndex(-1);
		} else {
			setSuggestions([]);
			setShowSuggestions(false);
		}
	};

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
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl">Guess the City</h2>
      {randomCity && randomCity.additionalData && (
        <MyMap
          position={[
            parseFloat(randomCity.additionalData.latitude),
            parseFloat(randomCity.additionalData.longitude),
          ]}
          zoom={5}
          markers={markers}
        />
      )}
      {randomCity && randomCity.additionalData && (
        <div>
          <div className="py-5">Nombre d'essais : {nbTries}</div>
					<div className="flex items-center gap-2">
						<button
							className="btn btn-neutral"
							disabled={nbTries < 3}
							onClick={() =>
								randomCity.additionalData &&
								handleIndiceClick(randomCity.additionalData.zip_code)
							}
						>
							Code postal
						</button>
						<button
							className="btn btn-neutral"
							disabled={nbTries < 5}
							onClick={() =>
								randomCity.additionalData &&
								handleIndiceClick(randomCity.additionalData.region_name)
							}
						>
							Région
						</button>
						<button
							className="btn btn-neutral"
							disabled={nbTries < 8}
							onClick={() =>
								randomCity.additionalData &&
								handleIndiceClick(randomCity.additionalData.department_name)
							}
						>
							Département
						</button>
					</div>
				</div>
			)}

			{indice && indice !== null && (
				<div className="mt-4">Indice : {indice}</div>
			)}

			{randomCity && (
				<div>
					<div className="join mt-9">
						<input
							className="input input-bordered join-item"
							ref={inputRef}
							type="text"
							value={guess}
							onChange={handleGuessChange}
							onKeyDown={handleKeyDown}
						/>
						<button className="btn btn-primary join-item" onClick={handleGuess}>
							Check
						</button>
					</div>

					{isCorrect && <div></div>}
					{showSuggestions && (
						<div
							className="suggestions-container bg-zinc-900 rounded-lg"
							ref={suggestionsRef}
						>
							{suggestions.map((suggestion, index) => (
								<div
									key={index}
									className={`suggestion py-4 px-4  ${
										selectedSuggestionIndex === index ? "selected bg-black" : ""
									}`}
									onClick={() => handleSuggestionClick(suggestion, index)}
								>
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
}
