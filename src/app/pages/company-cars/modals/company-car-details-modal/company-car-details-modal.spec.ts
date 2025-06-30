import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCarDetailsModal } from './company-car-details-modal';

describe('CompanyCarDetailsModal', () => {
  let component: CompanyCarDetailsModal;
  let fixture: ComponentFixture<CompanyCarDetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCarDetailsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCarDetailsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
