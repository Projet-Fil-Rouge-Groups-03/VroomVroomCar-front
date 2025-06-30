import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCorner } from './ad-corner';

describe('AdCorner', () => {
  let component: AdCorner;
  let fixture: ComponentFixture<AdCorner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdCorner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdCorner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
