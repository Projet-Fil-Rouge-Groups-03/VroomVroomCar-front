import { TestBed } from '@angular/core/testing';

import { UserService } from './user';
import { User, UserRequest, UserStatus } from '../models/user.model';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/users`;

  const mockUser: User = {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    mail: 'jean.dupont@example.com',
    libelle: 'Utilisateur Standard',
    codePostal: '75001',
    ville: 'Paris',
    status: UserStatus.ACTIF,
  };

  const mockUserList: User[] = [mockUser];

  const mockUserRequest: UserRequest = {
    nom: 'Martin',
    prenom: 'Claire',
    mail: 'claire.martin@example.com',
    libelle: 'Nouvel Utilisateur',
    codePostal: '69001',
    ville: 'Lyon',
    status: UserStatus.ACTIF,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UserService,
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all users via GET', () => {
    service.getAllUsers().subscribe((users) => {
      expect(users).toEqual(mockUserList);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserList);
  });

  it('should get a user by id via GET', () => {
    const userId = 1;
    service.getUserById(userId).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get a user by nom via GET with params', () => {
    const nom = 'Dupont';
    service.getUserByNom(nom).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/find-by-nom?nom=Dupont`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should create a user via POST', () => {
    const createdUser: User = {
      id: 2,
      nom: mockUserRequest.nom,
      prenom: mockUserRequest.prenom,
      mail: mockUserRequest.mail,
      libelle: mockUserRequest.libelle,
      codePostal: mockUserRequest.codePostal,
      ville: mockUserRequest.ville,
      status: mockUserRequest.status ?? UserStatus.ACTIF,
    };

    service.createUser(mockUserRequest).subscribe((user) => {
      expect(user).toEqual(createdUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/create-user`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUserRequest);
    req.flush(createdUser);
  });

  it('should update a user by id via PUT', () => {
    const userId = 1;
    const updatedRequest: UserRequest = { ...mockUserRequest, nom: 'Durand' };
    const updatedUser: User = {
      id: userId,
      nom: updatedRequest.nom,
      prenom: updatedRequest.prenom,
      mail: updatedRequest.mail,
      libelle: updatedRequest.libelle,
      codePostal: updatedRequest.codePostal,
      ville: updatedRequest.ville,
      status: updatedRequest.status ?? UserStatus.ACTIF,
    };

    service.updateUserById(userId, updatedRequest).subscribe((user) => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/edit-user/${userId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedRequest);
    req.flush(updatedUser);
  });

  it('should update a user by nom via PUT with params', () => {
    const nom = 'Dupont';
    const updatedRequest: UserRequest = { ...mockUserRequest, ville: 'Marseille' };
    const updatedUser: User = {
      id: mockUser.id,
      nom: updatedRequest.nom,
      prenom: updatedRequest.prenom,
      mail: updatedRequest.mail,
      libelle: updatedRequest.libelle,
      codePostal: updatedRequest.codePostal,
      ville: updatedRequest.ville,
      status: updatedRequest.status ?? UserStatus.ACTIF,
    };

    service.updateUserByNom(nom, updatedRequest).subscribe((user) => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/edit-user-by-nom?nom=${nom}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedRequest);
    req.flush(updatedUser);
  });

  it('should delete a user via DELETE and return a string', () => {
    const userId = 1;
    const message = 'Utilisateur supprimé avec succès';

    service.deleteUser(userId).subscribe((res) => {
      expect(res).toBe(message);
    });

    const req = httpMock.expectOne(`${apiUrl}/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(message);
  });
});