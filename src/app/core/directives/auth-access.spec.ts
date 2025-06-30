import { TestBed } from '@angular/core/testing';

import { AuthAccess } from './auth-access';

describe('AuthAccess', () => {
  let service: AuthAccess;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthAccess);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
