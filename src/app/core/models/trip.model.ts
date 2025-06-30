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
