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
export enum GameStates {
	"playing",
	"win",
	"lose",
}
export enum Statuses {
	"absent",
	"present",
	"correct",
	"guessing",
}

export type CharStatus = keyof typeof Statuses;

interface Cell {
	value: string;
	status: CharStatus;
}

export type Row = Cell[];

export type User = {
	id: string;
	solved: number;
	name: string;
};

export interface City {
	zip_code: string;
	city_code: string;
	department_number: string;
}
