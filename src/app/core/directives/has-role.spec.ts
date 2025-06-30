import { TestBed } from '@angular/core/testing';

import { HasRole } from './has-role';

describe('HasRole', () => {
  let service: HasRole;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HasRole);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
