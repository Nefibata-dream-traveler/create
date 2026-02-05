export interface PestPosition {
  x: number; // Normalized -1 to 1
  y: number; // Normalized -1 to 1
}

export interface SystemState {
  temperatures: [number, number, number]; // Bottom, Middle, Top sensors
  humidity: number; // Percentage
  pestCount: number;
  pestPosition: PestPosition | null;
  lastUpdated: number;
}

export interface HistoryPoint {
  time: string;
  temp1: number;
  temp2: number;
  temp3: number;
  humidity: number;
  pestCount: number;
}

export enum SimulationEvent {
  NORMAL = 'NORMAL',
  HEAT_SPIKE = 'HEAT_SPIKE',
  HIGH_HUMIDITY = 'HIGH_HUMIDITY',
  PEST_INVASION = 'PEST_INVASION'
}