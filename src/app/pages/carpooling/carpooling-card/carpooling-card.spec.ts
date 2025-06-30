import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingCard } from './carpooling-card';

describe('CarpoolingCard', () => {
  let component: CarpoolingCard;
  let fixture: ComponentFixture<CarpoolingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarpoolingCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpoolingCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
