// src/app/services/subscribe.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SubscribeRequest, Subscribe } from '../models/subscribe.model';

@Injectable({
  providedIn: 'root'
})
export class SubscribeService {
  private apiUrl = `${environment.apiUrl}/api/subscribe`;

  constructor(private http: HttpClient) { }

  // POST /create
  create(request: SubscribeRequest): Observable<Subscribe> {
    return this.http.post<Subscribe>(`${this.apiUrl}/create`, request, { withCredentials: true });
  }

  // GET / (toutes les inscriptions)
  findAll(): Observable<Subscribe[]> {
    return this.http.get<Subscribe[]>(this.apiUrl, { withCredentials: true });
  }

  // GET /{userId}/{tripId}
  findById(userId: number, tripId: number): Observable<Subscribe> {
    return this.http.get<Subscribe>(`${this.apiUrl}/${userId}/${tripId}`, { withCredentials: true });
  }

  // GET /find-by-trip/{id}
  findByTrip(tripId: number): Observable<Subscribe[]> {
    return this.http.get<Subscribe[]>(`${this.apiUrl}/find-by-trip/${tripId}`, { withCredentials: true });
  }
  
  // GET /find-by-user/{id}
  findByUser(userId: number): Observable<Subscribe[]> {
    return this.http.get<Subscribe[]>(`${this.apiUrl}/find-by-user/${userId}`, { withCredentials: true });
  }
  
  // PUT /update/{userId}/{tripId}
  update(userId: number, tripId: number, request: SubscribeRequest): Observable<Subscribe> {
    return this.http.put<Subscribe>(`${this.apiUrl}/update/${userId}/${tripId}`, request, { withCredentials: true });
  }

  // DELETE /delete/{userId}/{tripId}
  delete(userId: number, tripId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${userId}/${tripId}`, { 
      responseType: 'text', 
      withCredentials: true 
    });
  }
}