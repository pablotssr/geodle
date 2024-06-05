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
