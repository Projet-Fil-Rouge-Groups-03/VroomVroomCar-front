import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { RequestTrip, Trip } from '../models/trip.model';
import { VehiculeType } from '../models/company-car.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiURL = `${environment.apiUrl}/api/trips`;

  constructor(private http : HttpClient) { }

  // Create Trip (POST)
  createTrip(trip: RequestTrip): Observable<Trip> {
    return this.http.post<Trip>(`${this.apiURL}/create`, trip);
  }
  // Read Trip (GET)
  getAllTrips(): Observable<Trip[]>{
    return this.http.get<Trip[]>(this.apiURL);
  }
  getTripById(id : number) : Observable<Trip>{
    return this.http.get<Trip>(`${this.apiURL}/${id}`);
  }
  // Update Trip (PUT)
  updateTrip(id: number, trip : RequestTrip): Observable<Trip>{
    return this.http.put<Trip>(`${this.apiURL}/update/${id}`, trip);
  }
  // Delete Trip (DELETE)
  deleteTrip(tripId: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/delete/${tripId}`, { responseType: 'text' });
  }
  // === GET + spécifiques === //
  searchTrips(villeDepart?: string, villeArrivee?: string, dateDebutStr?: string, heureDepart?: string, vehiculeType: VehiculeType = VehiculeType.TOUS
  ): Observable<Trip[]> {
    let params = new HttpParams();
    if (villeDepart) params = params.set('villeDepart', villeDepart);
    if (villeArrivee) params = params.set('villeArrivee', villeArrivee);
    if (dateDebutStr) params = params.set('dateDebutStr', dateDebutStr);
    if (heureDepart) params = params.set('heureDepart', heureDepart);
    if (vehiculeType && vehiculeType !== VehiculeType.TOUS) params = params.set('vehiculeType', vehiculeType);
    return this.http.get<Trip[]>(`${this.apiURL}/search`, { params });
  }
  getUpcomingTrip(userId : number): Observable<Trip[]>{
    return this.http.get<Trip[]>(`${this.apiURL}/upcoming/${userId}`);
  }
  getPastTrip(userId : number): Observable<Trip[]>{
    return this.http.get<Trip[]>(`${this.apiURL}/past/${userId}`);
  }
}
