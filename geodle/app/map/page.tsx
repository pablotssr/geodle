"use client";

import dynamic from "next/dynamic";
import React from "react";
import { useCityData } from "../context/CityDataContext";
import Loader from "../components/Layout/Loader";
import { DEBUG } from "../lib/definitions";

const MapPanel = dynamic(() => import("../components/MapPanel/MapPanel"), {
    ssr: false,
});

const Map = () => {
    const { randomCity } = useCityData();

    return randomCity ? (
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-3xl text-center font-bold mb-4 text-base-content">
                Guess the City
            </h2>
            <MapPanel />
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
    );
};

export default Map;
