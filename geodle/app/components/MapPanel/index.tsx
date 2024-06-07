// 'use client'
import React, { useState, useRef } from "react";
import MyMap from "../Map";
import { Markers, DEBUG, MapPanelProps } from "../../lib/definitions";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useCityData } from "@/app/context/CityDataContext";

const index = (city:MapPanelProps) => {
	const { randomCity, jsonData } = useCityData();
	const searchParams = useSearchParams();
	const [markers, setMarkers] = useState<Markers[] | null>(null);
	const [guess, setGuess] = useState<string>("");
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
	const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
	useState<number>(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLDivElement>(null);
	
  const type = searchParams.get("type");

  const handleGuess = () => {
		if (jsonData) {
			const isCityMatched = jsonData.some(
				(city: { nom_commune: string }) =>
					city.nom_commune.toUpperCase() === guess.toUpperCase()
			);

			if (isCityMatched) {
				const matchedCity = jsonData.find(
					(city: { nom_commune: string }) =>
						city.nom_commune.toUpperCase() === guess.toUpperCase()
				);

				if (matchedCity) {
					const matchedCityPosition: [number, number] = [
						matchedCity.geo_point_2d.lat,
						matchedCity.geo_point_2d.lon,
					];

					const newMarker: Markers = {
						position: matchedCityPosition,
						nom_commune: matchedCity.nom_commune,
					};

					setMarkers((prevMarkers) =>
						prevMarkers ? [...prevMarkers, newMarker] : [newMarker]
					);
				}
			}
		}

		if (randomCity) {
			if (guess.toUpperCase() === randomCity.nom_commune.toUpperCase()) {
				setIsCorrect(true);
			} else {
				setIsCorrect(false);
			}
		}
	};

	const handleGuessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value.toUpperCase();
		setGuess(value);

		if (value.trim() !== "") {
			const filteredSuggestions = jsonData
				? jsonData
						.filter((city: { type: string }) => {
							if (type === "Prefecture") {
								return city.type === "Préfecture";
							} else if (type === "SousPrefecture") {
								return city.type === "Sous-préfecture";
							}
							return true;
						})
						.map((city: { nom_commune: string }) =>
							city.nom_commune.toUpperCase()
						)
						.filter((city: string) => city.startsWith(value))
				: [];
			setSuggestions(filteredSuggestions);
			setShowSuggestions(true);
			setSelectedSuggestionIndex(-1);
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
		setSelectedSuggestionIndex(-1);
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	return (
		<>
			{DEBUG && randomCity?.additionalData && (
				<div className="m-4 p-4 bg-base-200 shadow-md rounded-md">
					<p className="text-lg font-semibold">City Information</p>
					<div className="mt-2">
						<p className="text-gray-500">City Code: {randomCity?.nom_commune}</p>
						<p className="text-gray-500">
							Zip Code: {randomCity?.additionalData.zip_code}
						</p>
						<p className="text-gray-500">
							Department: {randomCity?.additionalData.department_name}
						</p>
						<p className="text-gray-500">
							Region: {randomCity?.additionalData.region_name}
						</p>
						<p className="text-gray-500">
							Code Insee: {randomCity?.insee_commune}
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
					<button onClick={handleGuess} className="btn btn-square btn-outline">
						<FontAwesomeIcon icon={faSearch} />
					</button>
				</label>
			</div>

			{isCorrect !== null && (
				<p>{isCorrect ? "Yes, that's correct!" : "No, try again."}</p>
			)}
			{showSuggestions && (
				<div
					className="suggestions-container flex flex-col gap-2"
					ref={suggestionsRef}
				>
					{suggestions.map((suggestion, index) => (
						<div
							key={index}
							className={`cursor-pointer ${
								selectedSuggestionIndex === index ? "selected" : ""
							}`}
							onClick={() => handleSuggestionClick(suggestion, index)}
						>
							{suggestion}
						</div>
					))}
				</div>
			)}
			{randomCity?.additionalData && (
				<MyMap
					position={[
						parseFloat(randomCity.geo_point_2d.lat),
						parseFloat(randomCity.geo_point_2d.lon),
					]}
					zoom={5}
					markers={markers || []}
				/>
			)}
		</>
	);
};

export default index;
