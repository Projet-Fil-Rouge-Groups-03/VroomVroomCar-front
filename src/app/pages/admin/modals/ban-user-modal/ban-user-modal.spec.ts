import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanUserModal } from './ban-user-modal';

describe('BanUserModal', () => {
  let component: BanUserModal;
  let fixture: ComponentFixture<BanUserModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanUserModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BanUserModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
