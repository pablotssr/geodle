// src/components/Map.tsx
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLngTuple } from "leaflet";
import { MyMapProps } from "../lib/definitions.ts";

export default function MyMap({ position, zoom, markers }: MyMapProps) {

    const position: LatLngTuple = [46.603354, 1.888334];
    const zoom = 6; // Adjust zoom level as needed

  return (
    <MapContainer center={position} zoom={zoom} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>{`Attempt ${marker.nom_commune}`}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
