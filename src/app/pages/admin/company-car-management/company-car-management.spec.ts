import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCarManagement } from './company-car-management';

describe('CompanyCarManagement', () => {
  let component: CompanyCarManagement;
  let fixture: ComponentFixture<CompanyCarManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCarManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCarManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
