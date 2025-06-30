import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCarFilter } from './company-car-filter';

describe('CompanyCarFilter', () => {
  let component: CompanyCarFilter;
  let fixture: ComponentFixture<CompanyCarFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCarFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCarFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
