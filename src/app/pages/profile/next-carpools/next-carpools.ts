import { Component, ViewChild } from '@angular/core';
import { AddEditCarpoolingModal } from '../modals/add-edit-carpooling-modal/add-edit-carpooling-modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-next-carpools',
  imports: [AddEditCarpoolingModal, CommonModule],
  templateUrl: './next-carpools.html',
  styleUrl: './next-carpools.css',
})
export class NextCarpools {
  @ViewChild('addEditModal') addEditModal!: AddEditCarpoolingModal;

  openModalAdd() {
    this.addEditModal.openModal();
  }

  openModalEdit(carpoolData: any) {
    this.addEditModal.openModal(carpoolData);
  }

  onCarpoolSaved(event: any) {
    console.log('Covoiturage sauvegardé !', event);
  }
}
