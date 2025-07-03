import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategorieVehicule } from '../models/car.model';
import { CompanyCar } from '../models/company-car.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyCarService {
  private apiURL = `${environment.apiUrl}/api/trips`;

  constructor(private http : HttpClient) { }

  // GET par id
  getCompanyCarById(id: number): Observable<CompanyCar> {
    return this.http.get<CompanyCar>(`${this.apiURL}/${id}`);
  }

  // GET all
   getAllCars(): Observable<CompanyCar[]> {
    return this.http.get<CompanyCar[]>(this.apiURL);
  }

  // POST
  createCar(companyCar: CompanyCar): Observable<CompanyCar> {
    return this.http.post<CompanyCar>(`${this.apiURL}/create`, companyCar);
  }
  
  // UPDATE
  updateCar(id: number, companyCar : CompanyCar): Observable<CompanyCar>{
    return this.http.put<CompanyCar>(`${this.apiURL}/update/${id}`, companyCar)
  }
  
  // DELETE
  deleteCar(id: number) : Observable<CompanyCar>{
    return this.http.delete<CompanyCar>(`${this.apiURL}/${id}`);
  }
  
  // === GET + spécifiques ===

  searchCarsByMarque(marque: string, size: number = 5): Observable<CompanyCar[]> {
  const params = new HttpParams()
    .set('marque', marque)
    .set('size', size.toString());

  return this.http.get<CompanyCar[]>(`${this.apiURL}/search/marque`, { params });
}

searchCarsByModele(modele: string, size: number = 5): Observable<CompanyCar[]> {
  const params = new HttpParams()
    .set('modele', modele)
    .set('size', size.toString());

  return this.http.get<CompanyCar[]>(`${this.apiURL}/search/modele`, { params });
}

getCarsByCategories(categorie: CategorieVehicule, size: number = 5): Observable<CompanyCar[]> {
  const params = new HttpParams().set('size', size.toString());
  return this.http.get<CompanyCar[]>(`${this.apiURL}/categorie/${categorie}`, { params });
}

searchCarsByImmatriculation(immatriculation: string, size: number = 5): Observable<CompanyCar[]> {
  const params = new HttpParams()
    .set('immatriculation', immatriculation)
    .set('size', size.toString());

  return this.http.get<CompanyCar[]>(`${this.apiURL}/search/modele`, { params });
}

searchCompanyCar(marque?: string, modele?: string,nbDePlaces: number = 0, dateDebutStr?: string, dateFinStr?: string
): Observable<CompanyCar[]> {
  let params = new HttpParams();

  if (marque) params = params.set('marque', marque);
  if (modele) params = params.set('modele', modele);
  if (nbDePlaces && nbDePlaces > 0) params = params.set('nbDePlaces', nbDePlaces.toString());
  if (dateDebutStr) params = params.set('dateDebutStr', dateDebutStr);
  if (dateFinStr) params = params.set('dateFinStr', dateFinStr);

  return this.http.get<CompanyCar[]>(`${this.apiURL}/search`, { params });
}


}
