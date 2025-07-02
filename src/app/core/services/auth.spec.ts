import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth';
import { User, UserStatus } from '../models/user.model';
import { environment } from '../../../environments/environment';

const mockUser: User = {
  id: 1,
  nom: 'Test',
  prenom: 'User',
  mail: 'test@example.com',
  libelle: '',
  codePostal: '',
  ville: '',
  status: UserStatus.ACTIF,
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: Router, useValue: spy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const req = httpMock.expectOne(`${apiUrl}/api/auth/me`);
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(service).toBeTruthy();
  });

  describe('Session Restoration (Constructor)', () => {
    it('should restore session successfully on initialization if cookie is valid', () => {
      const req = httpMock.expectOne(`${apiUrl}/api/auth/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
      expect(service.currentUser).toEqual(mockUser);
    });

    it('should set user to null on initialization if session restoration fails', () => {
      const req = httpMock.expectOne(`${apiUrl}/api/auth/me`);
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
      expect(service.currentUser).toBeNull();
    });
  });

  describe('#login', () => {
    it('should log in a user and update the user subject', () => {
      const restoreReq = httpMock.expectOne(`${apiUrl}/api/auth/me`);
      restoreReq.flush(null, { status: 401, statusText: 'Unauthorized' });

      const loginData = { mail: 'test@example.com', motDePasse: 'password' };
      service.login(loginData).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockUser);
      expect(service.currentUser).toEqual(mockUser);
    });
  });

  describe('#logout', () => {
    it('should log out the user, clear the subject, and navigate to login', () => {
      const restoreReq = httpMock.expectOne(`${apiUrl}/api/auth/me`);
      restoreReq.flush(mockUser);

      service.logout().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/logout`);
      req.flush({});
      
      expect(service.currentUser).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});