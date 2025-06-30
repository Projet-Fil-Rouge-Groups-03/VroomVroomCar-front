export interface RegisterRequest {
  nom: string;
  prenom: string;
  mail: string;
  ville: string;
  codePostal: string;
  libelle: string;
  motDePasse: string;
}

export interface LoginRequest {
  mail: string;
  motDePasse: string;
}