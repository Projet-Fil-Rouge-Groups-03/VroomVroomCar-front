import { Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { ModalParticipantsInformations } from '../../../../shared/components/modal-participants-informations/modal-participants-informations';
import { ModalCarInformations } from '../../../../shared/components/modal-car-informations/modal-car-informations';

@Component({
  selector: 'app-carpooling-details-modal',
  imports: [ModalParticipantsInformations, ModalCarInformations],
  templateUrl: './carpooling-details-modal.html',
  styleUrl: './carpooling-details-modal.css'
})
export class CarpoolingDetailsModal {
  @ViewChild('carpoolingDetailsModal') myDialog!: ElementRef<HTMLDialogElement>;

  organizer = input<string>('Jean Dupont');

  closed = output<void>();

  openModal() {
    if (this.myDialog && this.myDialog.nativeElement) {
      this.myDialog.nativeElement.showModal();
    }
  }

  closeModal() {
    if (this.myDialog && this.myDialog.nativeElement) {
      this.myDialog.nativeElement.close();
      this.closed.emit();
    }
  }
}
