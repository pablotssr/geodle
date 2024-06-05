// src/components/Map.tsx
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLngTuple } from "leaflet";

interface MapProps {
  position?: LatLngTuple;
  zoom?: number;
}

const defaultPosition: LatLngTuple = [46.603354, 1.888334];
const defaultZoom = 6; // Adjust zoom level as needed

export default function Map({ position = defaultPosition, zoom = defaultZoom }: MapProps) {
  return (
    <MapContainer className="h-screen" center={position} zoom={zoom} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
