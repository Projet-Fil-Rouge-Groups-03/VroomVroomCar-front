import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TripService } from '../services/trip';
import { Trip, RequestTrip } from '../models/trip.model';
import { environment } from '../../../environments/environment';
import { VehiculeType } from '../models/company-car.model';


describe('TripService', () => {
  let service: TripService;
  let httpMock: HttpTestingController;
  const apiURL = `${environment.apiUrl}/api/trips`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TripService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TripService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockTrip: Trip = {
    id: 1,
    lieuDepart: '',
    villeDepart: 'Paris',
    lieuArrivee: '',
    villeArrivee: 'Lyon',
    dateDebut: '2024-01-15',
    dateFin: '2024-01-15',
    heureDepart: '09:00',
    heureArrivee: '12:00',
    nbPlacesRestantes: 3,
    organisateurId: 1,
    carId: 1
  };

  const mockRequestTrip: RequestTrip = {
    id: 1,
    lieuDepart: '',
    villeDepart: 'Paris',
    lieuArrivee: '',
    villeArrivee: 'Lyon',
    dateDebut: '2024-01-15',
    dateFin: '2024-01-15',
    heureDepart: '09:00',
    heureArrivee: '12:00',
    nbPlacesRestantes: 3,
    organisateurId: 1,
    carId: 1
  };

  const mockTrips: Trip[] = [
    mockTrip,
    { ...mockTrip, id: 2, villeDepart: 'Marseille', villeArrivee: 'Nice' }
  ];

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('CRUD Operations', () => {
    it('should create a trip', () => {
      service.createTrip(mockRequestTrip).subscribe(trip => {
        expect(trip).toEqual(mockTrip);
      });

      const req = httpMock.expectOne(`${apiURL}/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequestTrip);
      req.flush(mockTrip);
    });

    it('should get all trips', () => {
      service.getAllTrips().subscribe(trips => {
        expect(trips.length).toBe(2);
        expect(trips).toEqual(mockTrips);
      });

      const req = httpMock.expectOne(apiURL);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrips);
    });

    it('should get trip by id', () => {
      service.getTripById(1).subscribe(trip => {
        expect(trip).toEqual(mockTrip);
      });

      const req = httpMock.expectOne(`${apiURL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrip);
    });

    it('should update a trip', () => {
      service.updateTrip(1, mockRequestTrip).subscribe(trip => {
        expect(trip).toEqual(mockTrip);
      });

      const req = httpMock.expectOne(`${apiURL}/update/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockRequestTrip);
      req.flush(mockTrip);
    });

    it('should delete a trip', () => {
      service.deleteTrip(1).subscribe(trip => {
        expect(trip).toEqual(mockTrip);
      });

      const req = httpMock.expectOne(`${apiURL}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockTrip);
    });
  });

  describe('Search Operations', () => {
    it('should search trips with all parameters', () => {
      service.searchTrips('Paris', 'Lyon', '2024-01-15', '09:00', VehiculeType.VOITURE_COVOIT)
        .subscribe(trips => {
          expect(trips).toEqual(mockTrips);
        });

      const req = httpMock.expectOne(r => 
        r.url === `${apiURL}/search` &&
        r.params.get('villeDepart') === 'Paris' &&
        r.params.get('villeArrivee') === 'Lyon' &&
        r.params.get('dateDebutStr') === '2024-01-15' &&
        r.params.get('heureDepart') === '09:00' &&
        r.params.get('vehiculeType') === VehiculeType.VOITURE_COVOIT
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockTrips);
    });

    it('should search trips with partial parameters', () => {
      service.searchTrips('Paris', 'Lyon').subscribe(trips => {
        expect(trips).toEqual(mockTrips);
      });

      const req = httpMock.expectOne(r => 
        r.url === `${apiURL}/search` &&
        r.params.get('villeDepart') === 'Paris' &&
        r.params.get('villeArrivee') === 'Lyon' &&
        !r.params.has('dateDebutStr') &&
        !r.params.has('heureDepart') &&
        !r.params.has('vehiculeType')
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockTrips);
    });

    it('should search trips with no parameters', () => {
      service.searchTrips().subscribe(trips => {
        expect(trips).toEqual(mockTrips);
      });

      const req = httpMock.expectOne(`${apiURL}/search`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockTrips);
    });
  });

  describe('User-specific Operations', () => {
    it('should get upcoming trips for user', () => {
      const userId = 123;
      service.getUpcomingTrip(userId).subscribe(trips => {
        expect(trips).toEqual(mockTrips);
      });

      const req = httpMock.expectOne(`${apiURL}/upcoming/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrips);
    });

    it('should get past trips for user', () => {
      const userId = 123;
      service.getPastTrip(userId).subscribe(trips => {
        expect(trips).toEqual(mockTrips);
      });

      const req = httpMock.expectOne(`${apiURL}/past/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrips);
    });
  });

});