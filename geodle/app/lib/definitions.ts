import { LatLngTuple } from "leaflet";

export interface City {
  gid: string;
  nom_commune: string;
  insee_commune: string;
  type: string;
  additionalData?: CityAdditionalData;
  geo_point_2d: {lon: string,lat: string}
}


export interface CityAdditionalData {
  insee_code: string;
  city_code: string;
  zip_code: string;
  label: string;
  latitude: string;
  longitude: string;
  department_name: string;
  department_number: string;
  region_name: string;
  region_geojson_name: string;
}

export interface MyMapProps {
  position: LatLngTuple;
  zoom: number;
  markers: Markers[];
}

export interface Markers {
  position: LatLngTuple;
  nom_commune: string;
}
