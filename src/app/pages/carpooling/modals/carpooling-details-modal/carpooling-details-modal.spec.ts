import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingDetailsModal } from './carpooling-details-modal';

describe('CarpoolingDetailsModal', () => {
  let component: CarpoolingDetailsModal;
  let fixture: ComponentFixture<CarpoolingDetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarpoolingDetailsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpoolingDetailsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
