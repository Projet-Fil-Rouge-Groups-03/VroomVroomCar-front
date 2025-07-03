import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RequestNotification } from '../models/notification.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Notification {
    private apiURL = `${environment.apiUrl}/api/notifications`;

  constructor(private http: HttpClient) { }

  // GET by User ID
  getUserNotifications(userId: number, size: number = 5): Observable<Notification[]> {
    const params = new HttpParams()
    .set('size', size.toString());
    return this.http.get<Notification[]>(`${this.apiURL}/user/${userId}`, { params });
  }

  // CREATE
  createNotification(notification: RequestNotification): Observable<Notification> {
    return this.http.post<Notification>(`${this.apiURL}/create`, notification);
  }

  // DELETE
  deleteNotification(id: number): Observable<Notification> {
    return this.http.delete<Notification>(`${this.apiURL}/delete/${id}`);
  }
}
