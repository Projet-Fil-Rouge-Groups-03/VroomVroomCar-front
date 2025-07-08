import { Car } from "./car.model";
import { Reservation } from "./reservation.model";
import { UserSummary } from "./user.model";

export interface Trip {
  id: number;
  dateDebut: string;
  dateFin: string;
  heureDepart: string;
  heureArrivee: string;
  lieuDepart: string;
  lieuArrivee: string;
  villeDepart: string;
  villeArrivee: string;
  nbPlacesRestantes: number;
  organisateurId: number;
  carId: number;
  car?: Car;
  organisateur?: UserSummary;
  timeTravel?: string;
  distanceInKm?: number;
  pollution?: number;
}

export interface RequestTrip {
  id?: number;
  dateDebut: string;
  dateFin: string;
  heureDepart: string;
  lieuDepart: string;
  lieuArrivee: string;
  villeDepart: string;
  villeArrivee: string;
  organisateurId: number;
  carId: number;
}

export interface DisplayItem {
  id: number;
  type: 'TRIP' | 'RESERVATION';
  dateDebut: string;
  heureDepart: string;
  villeDepart: string;
  villeArrivee: string;
  car?: Car;
  nbPlacesRestantes?: number;
  originalData: Trip | Reservation; 
}