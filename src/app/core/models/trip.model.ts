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
}

export interface RequestTrip {
  id?: number;
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
}
