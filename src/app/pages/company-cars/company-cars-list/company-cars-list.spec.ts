import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCarsList } from './company-cars-list';

describe('CompanyCarsList', () => {
  let component: CompanyCarsList;
  let fixture: ComponentFixture<CompanyCarsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCarsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCarsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
