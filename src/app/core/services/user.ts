import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRequest  } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUserByNom(nom: string): Observable<User> {
    const params = new HttpParams().set('nom', nom);
    return this.http.get<User>(`${this.apiUrl}/find-by-nom`, { params });
  }

  createUser(userRequest: UserRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create-user`, userRequest);
  }

  updateUserById(id: number, userRequest: UserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/edit-user/${id}`, userRequest);
  }

  updateUserByNom(nom: string, userRequest: UserRequest): Observable<User> {
    const params = new HttpParams().set('nom', nom);
    return this.http.put<User>(`${this.apiUrl}/edit-user-by-nom`, userRequest, { params });
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
