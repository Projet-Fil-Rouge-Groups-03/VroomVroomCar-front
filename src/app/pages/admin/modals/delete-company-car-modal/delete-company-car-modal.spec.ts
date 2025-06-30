import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCompanyCarModal } from './delete-company-car-modal';

describe('DeleteCompanyCarModal', () => {
  let component: DeleteCompanyCarModal;
  let fixture: ComponentFixture<DeleteCompanyCarModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCompanyCarModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCompanyCarModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
