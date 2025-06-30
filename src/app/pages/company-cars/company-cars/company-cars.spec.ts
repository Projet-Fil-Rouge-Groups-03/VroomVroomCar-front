import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCars } from './company-cars';

describe('CompanyCars', () => {
  let component: CompanyCars;
  let fixture: ComponentFixture<CompanyCars>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCars]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCars);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
