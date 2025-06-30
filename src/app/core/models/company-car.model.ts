import { Car } from "./car.model";

export enum VehiculeStatus {
  EN_SERVICE = 'EN_SERVICE',
  HORS_SERVICE = 'HORS_SERVICE',
  REPARATION = 'REPARATION'
}

export enum VehiculeType {
  VOITURE_SERVICE = 'VOITURE_SERVICE',
  VOITURE_COVOIT = 'VOITURE_COVOIT',
  TOUS = 'TOUS'
}

export interface CompanyCar extends Car {
  immatriculation: string;
  urlPhoto: string;
  status: VehiculeStatus;
}
