"use client";

import Loader from "../components/Layout/Loader";
import MapPanel from "../components/MapPanel";
import { useCityData } from "../context/CityDataContext";

export default function Map() {
	const {randomCity} = useCityData();

	if(!randomCity) return <Loader/>
	
	return (
		<div>
			<MapPanel city={randomCity}/>
		</div>
	);
}
