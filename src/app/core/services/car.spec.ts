import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { CarService } from './car';
import {
  Car,
  CarRequest,
  Motorisation,
  CategorieVehicule,
} from '../models/car.model';
import { environment } from '../../../environments/environment';

describe('CarService', () => {
  let service: CarService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/cars`;

  const mockCar: Car = {
    id: 1,
    marque: 'Peugeot',
    modele: '208',
    nbDePlaces: 5,
    pollution: '0',
    infosSupp: 'Version électrique',
    utilisateurId: 10,
    utilisateurNom: 'Admin',
    motorisation: Motorisation.ELECTRIQUE,
    categorie: CategorieVehicule.CITADINES,
    co2ParKm: 0,
  };
  const mockCarList: Car[] = [mockCar];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), CarService],
    });
    service = TestBed.inject(CarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all cars via GET', () => {
    service.getAllCars().subscribe((cars) => {
      expect(cars.length).toBe(1);
      expect(cars).toEqual(mockCarList);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCarList);
  });

  it('should get a car by id via GET', () => {
    const carId = 1;
    service.getCarById(carId).subscribe((car) => {
      expect(car).toEqual(mockCar);
    });

    const req = httpMock.expectOne(`${apiUrl}/${carId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCar);
  });

  it('should create a car via POST', () => {
    const newCarRequest: CarRequest = {
      marque: 'Tesla',
      modele: 'Model 3',
      nbDePlaces: 5,
      utilisateurId: 2,
      utilisateurNom: 'didier',
      motorisation: Motorisation.ELECTRIQUE,
      categorie: CategorieVehicule.CITADINES,
    };
    const createdCar: Car = {
      ...mockCar,
      id: 2,
      marque: 'Tesla',
      modele: 'Model 3',
    };

    service.createCar(newCarRequest).subscribe((car) => {
      expect(car).toEqual(createdCar);
    });

    const req = httpMock.expectOne(`${apiUrl}/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCarRequest);
    req.flush(createdCar);
  });

  it('should update a car via PUT', () => {
    const carId = 1;
    const updatedCarRequest: CarRequest = { ...mockCar, modele: 'e-208' };

    service.updateCar(carId, updatedCarRequest).subscribe((car) => {
      expect(car.modele).toBe('e-208');
    });

    const req = httpMock.expectOne(`${apiUrl}/update/${carId}`);
    expect(req.request.method).toBe('PUT');
    req.flush({ ...mockCar, modele: 'e-208' });
  });

  it('should delete a car via DELETE and return a string message', () => {
    const carId = 1;
    const successMessage = 'Voiture supprimée avec succès';

    service.deleteCar(carId).subscribe((response) => {
      expect(response).toBe(successMessage);
    });

    const req = httpMock.expectOne(`${apiUrl}/delete/${carId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(successMessage, { status: 200, statusText: 'OK' });
  });

  it('should search cars by marque with params via GET', () => {
    const marque = 'Peugeot';
    const size = 10;

    service.searchCarsByMarque(marque, size).subscribe((cars) => {
      expect(cars).toEqual(mockCarList);
    });

    const req = httpMock.expectOne(
      `${apiUrl}/search/marque?marque=${marque}&size=${size}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCarList);
  });
});
