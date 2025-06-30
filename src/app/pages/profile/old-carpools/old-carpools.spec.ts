import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldCarpools } from './old-carpools';

describe('OldCarpools', () => {
  let component: OldCarpools;
  let fixture: ComponentFixture<OldCarpools>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OldCarpools]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldCarpools);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
