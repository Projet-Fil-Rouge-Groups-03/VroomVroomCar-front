export enum UserStatus {
  ADMIN = 'ADMIN',
  ACTIF = 'ACTIF',
  BANNI = 'BANNI'
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
  libelle: string;
  codePostal: string;
  ville: string;
  status: UserStatus;
}
