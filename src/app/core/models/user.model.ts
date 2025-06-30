export enum UserStatus {
  ADMIN = 'ROLE_ADMIN',
  ACTIF = 'ROLE_ACTIF',
  BANNI = 'ROLE_BANNI'
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
