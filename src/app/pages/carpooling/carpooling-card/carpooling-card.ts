import { Component, ElementRef, ViewChild } from '@angular/core';
import { CarpoolingDetailsModal } from '../modals/carpooling-details-modal/carpooling-details-modal';

@Component({
  selector: 'app-carpooling-card',
  imports: [CarpoolingDetailsModal],
  templateUrl: './carpooling-card.html',
  styleUrl: './carpooling-card.css'
})
export class CarpoolingCard {
  @ViewChild('carpoolingDetailsModal') cardModal!: CarpoolingDetailsModal;


  openCardModal() {
    if (this.cardModal) {
      this.cardModal.openModal();
    }
  }

}
