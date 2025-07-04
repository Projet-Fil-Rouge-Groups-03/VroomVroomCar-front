import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingList } from './carpooling-list';

describe('CarpoolingList', () => {
  let component: CarpoolingList;
  let fixture: ComponentFixture<CarpoolingList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarpoolingList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpoolingList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
