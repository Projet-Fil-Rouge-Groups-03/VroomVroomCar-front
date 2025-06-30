import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsManagement } from './reservations-management';

describe('ReservationsManagement', () => {
  let component: ReservationsManagement;
  let fixture: ComponentFixture<ReservationsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationsManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
