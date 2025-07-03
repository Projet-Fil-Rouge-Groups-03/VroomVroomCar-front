import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SubscribeService } from './subscribe';
import { SubscribeRequest, Subscribe } from '../models/subscribe.model';
import { environment } from '../../../environments/environment';

describe('SubscribeService', () => {
  let service: SubscribeService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/subscribe`;

  const mockUserId = 10;
  const mockTripId = 101;

  const mockSubscribe: Subscribe = {
    userId: mockUserId,
    tripId: mockTripId,
    dateInscription: '2023-10-27T10:00:00.000Z',
  };

 const mockSubscribeRequest: SubscribeRequest = {
    userId: mockUserId,
    tripId: mockTripId,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), SubscribeService],
    });
    service = TestBed.inject(SubscribeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a subscription via POST', () => {
    service.create(mockSubscribeRequest).subscribe(response => {
      expect(response).toEqual(mockSubscribe);
      expect(response.dateInscription).toBeDefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSubscribeRequest); 
    req.flush(mockSubscribe);
  });

  it('should update a subscription via PUT', () => {
    const updatedResponse = { ...mockSubscribe, dateInscription: new Date().toISOString() };
    
    service.update(mockUserId, mockTripId, mockSubscribeRequest).subscribe(response => {
      expect(response).toEqual(updatedResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/update/${mockUserId}/${mockTripId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockSubscribeRequest);
    req.flush(updatedResponse);
  });
});