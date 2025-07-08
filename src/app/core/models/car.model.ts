export enum Motorisation {
  ESSENCE = 'ESSENCE',
  HYBRIDE = 'HYBRIDE',
  ELECTRIQUE = 'ELECTRIQUE'
}

export enum CategorieVehicule {
  MICRO_URBAINES = 'MICRO_URBAINES',
  MINI_CITADINES = 'MINI_CITADINES',
  CITADINES = 'CITADINES',
  POLYVALENTES = 'POLYVALENTES',
  COMPACTES = 'COMPACTES',
  BERLINES_TAILLE_S = 'BERLINES_TAILLE_S',
  BERLINES_TAILLE_M = 'BERLINES_TAILLE_M',
  BERLINES_TAILLE_L = 'BERLINES_TAILLE_L',
  SUV = 'SUV',
  TOUT_TERRAINS = 'TOUT_TERRAINS',
  PICK_UP = 'PICK_UP'
}

export enum TypeVehicule {
  VOITURE_SERVICE = 'VOITURE_SERVICE',
  VOITURE_COVOIT = 'VOITURE_COVOIT'
}

export interface Car {
  id: number;
  marque: string;
  modele: string;
  nbDePlaces: number;
  pollution: string;
  infosSupp: string;
  utilisateurId: number;
  utilisateurNom: string;
  motorisation: Motorisation;
  categorie: CategorieVehicule;
  co2ParKm: number;
  type: TypeVehicule;
}

export interface CarRequest {
  id?: number;
  marque: string;
  modele: string;
  nbDePlaces: number;
  pollution?: string;
  infosSupp?: string;
  utilisateurId: number;
  utilisateurNom: string;
  motorisation: Motorisation;
  categorie: CategorieVehicule;
  co2ParKm?: number;
}