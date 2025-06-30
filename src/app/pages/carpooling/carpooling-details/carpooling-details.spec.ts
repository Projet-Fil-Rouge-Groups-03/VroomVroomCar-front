import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingDetails } from './carpooling-details';

describe('CarpoolingDetails', () => {
  let component: CarpoolingDetails;
  let fixture: ComponentFixture<CarpoolingDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarpoolingDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpoolingDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
