import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCarCard } from './company-car-card';

describe('CompanyCarCard', () => {
  let component: CompanyCarCard;
  let fixture: ComponentFixture<CompanyCarCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCarCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCarCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
