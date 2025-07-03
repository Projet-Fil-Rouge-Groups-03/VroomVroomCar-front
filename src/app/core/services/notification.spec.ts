import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Notification, RequestNotification } from '../models/notification.model';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

describe('Notification', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;
  const apiURL = `${environment.apiUrl}/api/notifications`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockNotification: Notification = {
    id: 1,
    contenu: 'Didier est super !',
    nom: 'DIDIER',
    date: '2024-01-15',
    userId: 1,
    userName: 'Didier'
  };

  const mockRequestNotification: RequestNotification = {
    contenu: 'Didier est super !',
    nom: 'DIDIER',
    date: '2024-01-15',
    userId: 1,
    userName: 'Didier'
  };

  const mockNotifications: Notification[] = [
    mockNotification,
    { ...mockNotification, id: 2,  
          contenu: 'Didier est super !', nom: 'DIDIER', date: '2024-01-15', userId: 1, userName: 'Didier'
    }
  ];

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a trip', () => {
    service.createNotification(mockRequestNotification).subscribe(trip => {
      expect(trip).toEqual(jasmine.objectContaining(mockNotification));
    });

    const req = httpMock.expectOne(`${apiURL}/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequestNotification);
    req.flush(mockNotification);
  });

  it('should get notifications for a user', () => {
    const userId = 42;

    service.getUserNotifications(userId).subscribe((notifications) => {
      expect(notifications.length).toBe(1);
      expect(notifications[0]).toEqual(jasmine.objectContaining(mockNotification));
    });

    const req = httpMock.expectOne(`${apiURL}/user/42?size=5`);
    expect(req.request.method).toBe('GET');
    req.flush([mockNotification]);
  });

  it('should delete a notification', () => {
    const id = 1;

    service.deleteNotification(id).subscribe((notification) => {
      expect(notification).toEqual(jasmine.objectContaining(mockNotification));
    });

    const req = httpMock.expectOne(`${apiURL}/delete/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockNotification);
  });
  
});
