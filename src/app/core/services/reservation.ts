import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {ReservationRequest, Reservation } from '../models/reservation.model';
import { Page } from '../models/pagination.model';
import { CompanyCar } from '../models/company-car.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/api/reservations`;

  constructor(private http: HttpClient) { }

  // POST /create
  createReservation(request: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/create`, request, { withCredentials: true });
  }

  // GET / (toutes les réservations)
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl, { withCredentials: true });
  }

  // GET /all-available-cars
  getAllAvailableCars(): Observable<CompanyCar[]> {
    return this.http.get<CompanyCar[]>(`${this.apiUrl}/all-available-cars`, { withCredentials: true });
  }

  // GET /{id}
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // GET /car/{carId}
  getReservationsByCarId(carId: number, page: number = 0, size: number = 5): Observable<Page<Reservation>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Reservation>>(`${this.apiUrl}/car/${carId}`, { params, withCredentials: true });
  }

  // Get /user/{userId}
  getReservationsByUserId(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`);
  }

  // PUT /update/{id}
  updateReservation(id: number, request: ReservationRequest): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/update/${id}`, request, { withCredentials: true });
  }

  // DELETE /delete/{id}
  deleteReservation(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { 
      responseType: 'text', 
      withCredentials: true 
    });
  }
}