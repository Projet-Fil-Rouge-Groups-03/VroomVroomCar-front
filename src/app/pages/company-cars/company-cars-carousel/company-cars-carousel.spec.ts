import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCarsCarousel } from './company-cars-carousel';

describe('CompanyCarsCarousel', () => {
  let component: CompanyCarsCarousel;
  let fixture: ComponentFixture<CompanyCarsCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCarsCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCarsCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
