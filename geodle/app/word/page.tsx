"use client";

import Loader from "../components/Layout/Loader";
import GamePanel from "../components/GamePanel";
import { useCityData } from "../context/CityDataContext";
import MapPanel from "../components/MapPanel";

export default function Jeu() {
  const { randomCity } = useCityData();

  return (
    <div className="flex flex-col items-center">
      {randomCity ? (
        <div>
          <h2 className="text-2xl font-bold mb-4 dark:text-slate">
            Guess the City
          </h2>
          <h4 className="text-2xl font-bold dark:text-white">
            {randomCity.nom_commune}
          </h4>
          <GamePanel city={randomCity} />
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
