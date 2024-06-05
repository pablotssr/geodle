import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { MyMapProps, Markers as MarkersType } from "../../lib/definitions";


export default function Map({position, zoom, markers}:MyMapProps) {
	return (
		<MapContainer center={position} zoom={zoom} scrollWheelZoom={true}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{markers?.map((marker: MarkersType, index: number) => (
				<Marker key={index} position={marker.position}>
					<Popup>{`Attempt ${marker.nom_commune}`}</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
