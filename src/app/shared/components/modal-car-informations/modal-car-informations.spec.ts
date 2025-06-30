import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCarInformations } from './modal-car-informations';

describe('ModalCarInformations', () => {
  let component: ModalCarInformations;
  let fixture: ComponentFixture<ModalCarInformations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCarInformations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCarInformations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
