/**
 * Interface générique représentant la structure de pagination
 * retournée par les API Spring Boot.
 * @template T Le type des objets dans le contenu de la page (ex: Reservation, Car,...).
 */
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Numéro de la page actuelle
}