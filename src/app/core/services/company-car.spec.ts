import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { environment } from "../../../environments/environment";
import { CompanyCarService } from "./company-car";
import { TestBed } from "@angular/core/testing";
import { CategorieVehicule, Motorisation } from "../models/car.model";
import { CompanyCar, VehiculeStatus } from "../models/company-car.model";

describe('CompanyCarService', () => {
  let service: CompanyCarService;
  let httpMock: HttpTestingController;
  const apiURL = `${environment.apiUrl}/api/trips`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompanyCarService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CompanyCarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockCompanyCar: CompanyCar = {
    id: 1,
    marque: 'Peugeot',
    modele: '308',
    immatriculation: 'AB-123-CD',
    nbDePlaces: 5,
    categorie: CategorieVehicule.CITADINES,
    urlPhoto: "",
    status: VehiculeStatus.EN_SERVICE,
    pollution: "",
    infosSupp: "",
    utilisateurId: 0,
    utilisateurNom: "",
    motorisation: Motorisation.ESSENCE,
    co2ParKm: 0
  };

  const mockCompanyCars: CompanyCar[] = [
    mockCompanyCar,
    { ...mockCompanyCar, id: 2, marque: 'Renault', modele: 'Clio', immatriculation: 'EF-456-GH' }
  ];

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('CRUD Operations', () => {
    it('should create a company car', () => {
      service.createCar(mockCompanyCar).subscribe(car => {
        expect(car).toEqual(mockCompanyCar);
      });

      const req = httpMock.expectOne(`${apiURL}/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCompanyCar);
      req.flush(mockCompanyCar);
    });

    it('should get all company cars', () => {
      service.getAllCars().subscribe(cars => {
        expect(cars.length).toBe(2);
        expect(cars).toEqual(mockCompanyCars);
      });

      const req = httpMock.expectOne(apiURL);
      expect(req.request.method).toBe('GET');
      req.flush(mockCompanyCars);
    });

    it('should get company car by id', () => {
      service.getCompanyCarById(1).subscribe(car => {
        expect(car).toEqual(mockCompanyCar);
      });

      const req = httpMock.expectOne(`${apiURL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCompanyCar);
    });

    it('should update a company car', () => {
      service.updateCar(1, mockCompanyCar).subscribe(car => {
        expect(car).toEqual(mockCompanyCar);
      });

      const req = httpMock.expectOne(`${apiURL}/update/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockCompanyCar);
      req.flush(mockCompanyCar);
    });

    it('should delete a company car', () => {
      service.deleteCar(1).subscribe(car => {
        expect(car).toEqual(mockCompanyCar);
      });

      const req = httpMock.expectOne(`${apiURL}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockCompanyCar);
    });
  });

  describe('Filter Operations', () => {
    it('should search cars by marque', () => {
      service.searchCarsByMarque('Peugeot').subscribe(cars => {
        expect(cars).toEqual(mockCompanyCars);
      });

      const req = httpMock.expectOne(r => 
        r.url === `${apiURL}/search/marque` &&
        r.params.get('marque') === 'Peugeot' &&
        r.params.get('size') === '5'
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockCompanyCars);
    });

    it('should search cars by modele', () => {
      service.searchCarsByModele('308').subscribe(cars => {
        expect(cars).toEqual(mockCompanyCars);
      });

      const req = httpMock.expectOne(r => 
        r.url === `${apiURL}/search/modele` &&
        r.params.get('modele') === '308' &&
        r.params.get('size') === '5'
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockCompanyCars);
    });

    it('should get cars by categories', () => {
      service.getCarsByCategories(CategorieVehicule.CITADINES).subscribe(cars => {
        expect(cars).toEqual(mockCompanyCars);
      });

      const req = httpMock.expectOne(r => 
        r.url === `${apiURL}/categorie/${CategorieVehicule.CITADINES}` &&
        r.params.get('size') === '5'
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockCompanyCars);
    });

    it('should search cars by immatriculation', () => {
      service.searchCarsByImmatriculation('AB-123-CD').subscribe(cars => {
        expect(cars).toEqual(mockCompanyCars);
      });

      const req = httpMock.expectOne(r => 
        r.url === `${apiURL}/search/modele` &&
        r.params.get('immatriculation') === 'AB-123-CD' &&
        r.params.get('size') === '5'
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockCompanyCars);
    });
  });

  describe('Search Operations', () => {
    it('should search company cars with all parameters', () => {
      service.searchCompanyCar('Peugeot', '308', 5, '2024-01-15', '2024-01-20')
        .subscribe(cars => {
          expect(cars).toEqual(mockCompanyCars);
        });

      const req = httpMock.expectOne(r => 
        r.url === `${apiURL}/search` &&
        r.params.get('marque') === 'Peugeot' &&
        r.params.get('modele') === '308' &&
        r.params.get('nbDePlaces') === '5' &&
        r.params.get('dateDebutStr') === '2024-01-15' &&
        r.params.get('dateFinStr') === '2024-01-20'
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockCompanyCars);
    });

    it('should search company cars with partial parameters', () => {
      service.searchCompanyCar('Peugeot', '308').subscribe(cars => {
        expect(cars).toEqual(mockCompanyCars);
      });

      const req = httpMock.expectOne(r => 
        r.url === `${apiURL}/search` &&
        r.params.get('marque') === 'Peugeot' &&
        r.params.get('modele') === '308' &&
        !r.params.has('nbDePlaces') &&
        !r.params.has('dateDebutStr') &&
        !r.params.has('dateFinStr')
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockCompanyCars);
    });


    it('should search company cars with no parameters', () => {
      service.searchCompanyCar().subscribe(cars => {
        expect(cars).toEqual(mockCompanyCars);
      });

      const req = httpMock.expectOne(`${apiURL}/search`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockCompanyCars);
    });
  });
});
