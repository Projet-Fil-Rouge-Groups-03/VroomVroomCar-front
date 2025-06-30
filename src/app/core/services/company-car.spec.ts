import { TestBed } from '@angular/core/testing';

import { CompanyCar } from './company-car';

describe('CompanyCar', () => {
  let service: CompanyCar;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyCar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
