import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalParticipantsInformations } from './modal-participants-informations';

describe('ModalParticipantsInformations', () => {
  let component: ModalParticipantsInformations;
  let fixture: ComponentFixture<ModalParticipantsInformations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalParticipantsInformations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalParticipantsInformations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
