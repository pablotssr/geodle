"use client";

import Loader from "../components/Layout/Loader";
import GamePanel from "../components/GamePanel/GamePanel";
import { useCityData } from "../context/CityDataContext";
import { DEBUG } from "../lib/definitions";

export default function Jeu() {
	const { randomCity } = useCityData();

	return (
		<div className="flex flex-col items-center flex-1 justify-center">
			{randomCity ? (
				<div>
					<h2 className="text-3xl text-center font-bold mb-4 text-base-content">
						Guess the City
					</h2>
					<GamePanel city={randomCity} />
					{DEBUG ? (
						<h4 className="my-4 text-xl text-center font-bold text-base-content">
							{randomCity.nom_commune}
						</h4>
					) : (
						""
					)}
				</div>
			) : (
				<Loader />
			)}
		</div>
	);
}
