import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface HouseSettings {
  temperature: number;
  humidity: number;
  illuminance: number;
  co2: number;
}

const initialState: HouseSettings = {
  temperature: 20,
  humidity: 60,
  illuminance: 25000,
  co2: 900,
};

export const houseSettings: Writable<HouseSettings> = writable(initialState);
