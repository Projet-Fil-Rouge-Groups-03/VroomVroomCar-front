import { TestBed } from '@angular/core/testing';

import { UserService } from './user';
import { User, UserStatus } from '../models/user.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

/*describe('User', () => {
  let service: User;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(User);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});*/

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    nom: 'Doe',
    prenom: 'John',
    mail: 'john.doe@example.com',
    libelle: 'rue des Lilas',
    codePostal: '75001',
    ville: 'Paris',
    status: UserStatus.ACTIF
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all users', () => {
    service.getAllUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0]).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/user');
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);
  });

  it('should retrieve user by ID', () => {
    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should retrieve user by nom', () => {
    service.getUserByNom('Doe').subscribe(user => {
      expect(user.nom).toBe('Doe');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/user/find-by-nom?nom=Doe');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should create a user', () => {
    service.createUser(mockUser).subscribe(user => {
      expect(user.id).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/user/create-user');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

  it('should update user by ID', () => {
    service.updateUserById(1, mockUser).subscribe(user => {
      expect(user.nom).toBe('Doe');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/user/edit-user/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockUser);
  });

  it('should update user by nom', () => {
    service.updateUserByNom('Doe', mockUser).subscribe(user => {
      expect(user.nom).toBe('Doe');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/user/edit-user-by-nom?nom=Doe');
    expect(req.request.method).toBe('PUT');
    req.flush(mockUser);
  });

  it('should delete a user by ID', () => {
    service.deleteUser(1).subscribe(response => {
      expect(response).toBe('L\'utilisateur à l\'id : 1 à bien été supprimé');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/user/1');
    expect(req.request.method).toBe('DELETE');
    req.flush("L'utilisateur à l'id : 1 à bien été supprimé");
  });
});
