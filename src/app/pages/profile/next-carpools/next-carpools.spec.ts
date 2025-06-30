import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextCarpools } from './next-carpools';

describe('NextCarpools', () => {
  let component: NextCarpools;
  let fixture: ComponentFixture<NextCarpools>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextCarpools]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextCarpools);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
