'use strict';

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { MyMapProps } from "../../lib/definitions";
import { LatLngBounds } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), {
  ssr: false,
});

const defaultPosition: [number, number] = [46.603354, 1.888334];
const defaultZoom = 5;

const franceBounds = new LatLngBounds(
  [41.3337, -5.5591], // Southwest coordinates
  [51.124, 9.6625]    // Northeast coordinates
);

export const Map: React.FC<MyMapProps> = ({ position = defaultPosition, zoom = defaultZoom, markers }) => {
  const [tileLayerUrl, setTileLayerUrl] = useState<string>(
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
  );

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const tileLayerUrl = storedTheme === 'dark'
      ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";
    setTileLayerUrl(tileLayerUrl);

    const updateTileLayerUrl = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTileLayerUrl = currentTheme === 'dark'
        ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";
      setTileLayerUrl(newTileLayerUrl);
    };

    const observer = new MutationObserver(updateTileLayerUrl);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      observer.disconnect();
    };
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
      <TileLayer url={tileLayerUrl} />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position} icon={marker.icon}>
          <Popup>
            <div className="text-center font-bold">{marker.nom_commune}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
