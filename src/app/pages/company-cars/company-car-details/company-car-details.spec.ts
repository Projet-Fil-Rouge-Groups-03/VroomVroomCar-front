import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCarDetails } from './company-car-details';

describe('CompanyCarDetails', () => {
  let component: CompanyCarDetails;
  let fixture: ComponentFixture<CompanyCarDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCarDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCarDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
