import { Car } from "./car.model";

export interface Reservation {
  id: number;
  dateDebut: string;
  dateFin: string;
  userId: number;
  carId: number;
  car?: Car;
}

export interface ReservationRequest {
  id?: number;
  dateDebut: string;
  dateFin: string;
  userId: number;
  carId: number;
}