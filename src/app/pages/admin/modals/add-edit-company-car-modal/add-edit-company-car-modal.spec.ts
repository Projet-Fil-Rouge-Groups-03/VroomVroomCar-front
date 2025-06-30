import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCompanyCarModal } from './add-edit-company-car-modal';

describe('AddEditCompanyCarModal', () => {
  let component: AddEditCompanyCarModal;
  let fixture: ComponentFixture<AddEditCompanyCarModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCompanyCarModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCompanyCarModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
