import { TestBed } from '@angular/core/testing';

import { RedirectIfNotAuth } from './redirect-if-not-auth';

describe('RedirectIfNotAuth', () => {
  let service: RedirectIfNotAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedirectIfNotAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
