// src/components/Map.tsx
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLngTuple } from "leaflet";
import { MyMapProps } from "../../lib/definitions";

export default function MyMap({ position, zoom, markers }: MyMapProps) {
  const positionMap: LatLngTuple = [46.603354, 1.888334];
  const zoomMap = 6; // Adjust zoom level as needed

  return (
    <MapContainer center={positionMap} zoom={zoomMap} scrollWheelZoom={true}>
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
}
