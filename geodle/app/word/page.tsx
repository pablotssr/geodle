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
          <h2 className="text-3xl text-center font-bold mb-4 dark:text-slate">
            Guess the City
          </h2>
          <GamePanel city={randomCity} />
          <h4 className="my-4 text-xl text-center font-bold dark:text-slate">
            {randomCity.nom_commune}
          </h4>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}