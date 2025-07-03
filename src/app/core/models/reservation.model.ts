export interface Reservation {
  id: number;
  dateDebut: string;
  dateFin: string;
  userId: number;
  carId: number;
}

export interface ReservationRequest {
  id?: number;
  dateDebut: string;
  dateFin: string;
  userId: number;
  carId: number;
}