import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car, CarRequest, CategorieVehicule } from '../models/car.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = `${environment.apiUrl}/api/cars`;

  constructor(private http: HttpClient) { }

  // GET all
  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl, { withCredentials: true });
  }

  // GET par id
  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // POST (create)
  createCar(carRequest: CarRequest): Observable<Car> {
    return this.http.post<Car>(`${this.apiUrl}/create`, carRequest, { withCredentials: true });
  }

  // PUT (update)
  updateCar(id: number, carRequest: CarRequest): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/update/${id}`, carRequest, { withCredentials: true });
  }

  // DELETE
  deleteCar(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { 
      responseType: 'text', 
      withCredentials: true 
    });
  }
  
  // --- Recherches spécifiques ---

  getCarsByUserId(userId: number, size: number = 5): Observable<Car[]> {
    const params = new HttpParams().set('size', size.toString());
    return this.http.get<Car[]>(`${this.apiUrl}/user/${userId}`, { params, withCredentials: true });
  }
  
  searchCarsByMarque(marque: string, size: number = 5): Observable<Car[]> {
    const params = new HttpParams().set('marque', marque).set('size', size.toString());
    return this.http.get<Car[]>(`${this.apiUrl}/search/marque`, { params, withCredentials: true });
  }

  searchCarsByModele(modele: string, size: number = 5): Observable<Car[]> {
    const params = new HttpParams().set('modele', modele).set('size', size.toString());
    return this.http.get<Car[]>(`${this.apiUrl}/search/modele`, { params, withCredentials: true });
  }
  
  getCarsByCategories(categorie: CategorieVehicule, size: number = 5): Observable<Car[]> {
    const params = new HttpParams().set('size', size.toString());
    return this.http.get<Car[]>(`${this.apiUrl}/categorie/${categorie}`, { params, withCredentials: true });
  }
}