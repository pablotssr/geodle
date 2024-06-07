import dynamic from "next/dynamic";
import React from "react";
import { MyMapProps } from "../../lib/definitions";

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
const defaultZoom = 6; // Adjust zoom level as needed

const Map: React.FC<MyMapProps> = ({
  position = defaultPosition,
  zoom = defaultZoom,
  markers,
}) => {
  return (
    <MapContainer
      className="mt-9 rounded"
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position} icon={marker.icon}>
          <Popup>{`${marker.nom_commune}`}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
