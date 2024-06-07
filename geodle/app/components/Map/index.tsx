import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { MyMapProps } from "../../lib/definitions";
import { LatLngBounds } from "leaflet";

// Dynamic import for react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
	() => import("react-leaflet").then((mod) => mod.MapContainer),
	{ ssr: false }
);
const TileLayer = dynamic(
	() => import("react-leaflet").then((mod) => mod.TileLayer),
	{ ssr: false }
);
const Marker = dynamic(
	() => import("react-leaflet").then((mod) => mod.Marker),
	{ ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
	ssr: false,
});

// Import CSS in a way that works with Next.js
if (typeof window !== "undefined") {
	require("leaflet/dist/leaflet.css");
	require("leaflet-defaulticon-compatibility");
	require("leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css");
}

const defaultPosition: [number, number] = [46.603354, 1.888334];
const defaultZoom = 5; // Adjust zoom level as needed

// Define the bounds for France
const franceBounds = new LatLngBounds(
	[41.3337, -5.5591], // Southwest coordinates (min latitude, min longitude)
	[51.124, 9.6625] // Northeast coordinates (max latitude, max longitude)
);

const Map: React.FC<MyMapProps> = ({
	position = defaultPosition,
	zoom = defaultZoom,
	markers,
}) => {
	const [tileLayerUrl, setTileLayerUrl] = useState<string>(
		"https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
	);

	useEffect(() => {
		// Detect system theme
		const prefersDarkMode = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		// Select tile layer URL based on system theme
		const tileLayerUrl = prefersDarkMode
			? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
			: "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png";

		setTileLayerUrl(tileLayerUrl);
	}, []);

	return (
		<MapContainer
			className="mt-9 rounded"
			center={position}
			zoom={zoom}
			maxZoom={8}
			minZoom={5}
			scrollWheelZoom={true}
			maxBounds={franceBounds}
			maxBoundsViscosity={1.0}
		>
			<TileLayer
				url={tileLayerUrl}
			/>
			{markers.map((marker, index) => (
				<Marker key={index} position={marker.position} icon={marker.icon}>
					<Popup>
						{<div className="text-center font-bold">{marker.nom_commune}</div>}
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
};

export default Map;
