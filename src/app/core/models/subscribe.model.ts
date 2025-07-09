export interface Subscribe {
  userId: number;
  prenom: string,
  nom: string,
  tripId: number;
  dateInscription: string;
}

export interface SubscribeRequest {
  userId: number;
  tripId: number;
}