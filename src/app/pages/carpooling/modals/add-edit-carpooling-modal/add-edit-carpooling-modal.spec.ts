import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCarpoolingModal } from './add-edit-carpooling-modal';

describe('AddEditCarpoolingModal', () => {
  let component: AddEditCarpoolingModal;
  let fixture: ComponentFixture<AddEditCarpoolingModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCarpoolingModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCarpoolingModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
