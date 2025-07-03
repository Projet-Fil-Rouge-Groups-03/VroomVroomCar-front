import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ReservationService } from './reservation';
import {ReservationRequest, Reservation } from '../models/reservation.model';
import { environment } from '../../../environments/environment';
import { Page } from '../models/pagination.model';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/reservations`;

  const mockReservation: Reservation = {
    id: 1,
    dateDebut: '2025-08-01',
    dateFin: '2025-08-05',
    userId: 10,
    carId: 2,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ReservationService],
    });
    service = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a reservation via POST', () => {
    const newReservationRequest: ReservationRequest = {
      dateDebut: '2025-08-01',
      dateFin: '2025-08-05',
      userId: 10,
      carId: 2,
    };

    service.createReservation(newReservationRequest).subscribe((reservation) => {
      expect(reservation).toEqual(mockReservation);
    });

    const req = httpMock.expectOne(`${apiUrl}/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newReservationRequest);
    req.flush(mockReservation);
  });
  
  it('should get all reservations via GET', () => {
    const mockReservationList = [mockReservation];
    service.getAllReservations().subscribe(reservations => {
      expect(reservations.length).toBe(1);
      expect(reservations).toEqual(mockReservationList);
    });
    
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockReservationList);
  });

  it('should get reservations for a car with pagination via GET', () => {
    const carId = 2;
    const page = 0;
    const size = 5;
    const mockPage: Page<Reservation> = {
      content: [mockReservation],
      totalPages: 1,
      totalElements: 1,
      size: 5,
      number: 0
    };

    service.getReservationsByCarId(carId, page, size).subscribe((pagedResult) => {
      expect(pagedResult.content.length).toBe(1);
      expect(pagedResult).toEqual(mockPage);
    });

    const req = httpMock.expectOne(`${apiUrl}/car/${carId}?page=${page}&size=${size}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should delete a reservation via DELETE', () => {
    const reservationId = 1;
    const successMessage = "Reservation supprimée avec succès";

    service.deleteReservation(reservationId).subscribe((response) => {
      expect(response).toBe(successMessage);
    });

    const req = httpMock.expectOne(`${apiUrl}/delete/${reservationId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(successMessage, { status: 200, statusText: 'OK' });
  });
});