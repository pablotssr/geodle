"use client";
import React, { useEffect, useState, useRef } from "react";
import MyMap from "../components/Map/";
import { CityAdditionalData, City, Markers, DEBUG } from "../lib/definitions";
import { useSearchParams } from "next/navigation";
import GamePanel from "../components/GamePanel";

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
			let filteredCities = jsonData;
			if (type === "Prefecture") {
				filteredCities = jsonData.filter((city) => city.type === "Préfecture");
			} else if (type === "SousPrefecture") {
				filteredCities = jsonData.filter(
					(city) => city.type === "Sous-préfecture"
				);
			}
			const randomIndex = Math.floor(Math.random() * filteredCities.length);
			const randomCityData = filteredCities[randomIndex];
			console.log("randomCityData: ", randomCityData.nom_commune);
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
	}, [jsonData, type]);

	const handleGuess = () => {
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

			const newMarker: Markers = {
				position: matchedCityPosition,
				nom_commune: matchedCity!.nom_commune,
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
								return city.type === "Préfecture";
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
			<h2 className="text-2xl font-bold mb-4 dark:text-slate">
				Guess the City
			</h2>
			{randomCity && (
				<div>
					<GamePanel randomCity={randomCity} />
					{DEBUG && randomCity.additionalData && (
						<div className="m-4 p-4 bg-base-200 shadow-md rounded-md">
							<p className="text-lg font-semibold">City Information</p>
							<div className="mt-2">
								<p className="text-gray-500">
									City Code: {randomCity.additionalData.city_code}
								</p>
								<p className="text-gray-500">
									Zip Code: {randomCity.additionalData.zip_code}
								</p>
								<p className="text-gray-500">
									Department: {randomCity.additionalData.department_name}
								</p>
								<p className="text-gray-500">
									Region: {randomCity.additionalData.region_name}
								</p>
								<p className="text-gray-500">
									Code Insee: {randomCity.insee_commune}
								</p>
							</div>
						</div>
					)}

					<div className="flex items-center mt-4">
						<label className="input input-bordered flex items-center gap-2">
							<input
								ref={inputRef}
								type="text"
								value={guess}
								onChange={handleGuessChange}
								onKeyDown={handleKeyDown}
								className="grow"
								placeholder="Search"
							/>
							<button
								onClick={handleGuess}
								className="btn btn-square btn-outline"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
									className="w-4 h-4 opacity-70"
								>
									<path
										fillRule="evenodd"
										d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</label>
					</div>

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
									onClick={() => handleSuggestionClick(suggestion, index)}
								>
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
