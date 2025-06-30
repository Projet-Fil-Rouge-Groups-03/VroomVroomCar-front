import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingFilter } from './carpooling-filter';

describe('CarpoolingFilter', () => {
  let component: CarpoolingFilter;
  let fixture: ComponentFixture<CarpoolingFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarpoolingFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpoolingFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
