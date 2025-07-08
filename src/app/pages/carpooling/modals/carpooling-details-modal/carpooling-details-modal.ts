import { Component, effect, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { ModalParticipantsInformations } from '../../../../shared/components/modal-participants-informations/modal-participants-informations';
import { ModalCarInformations } from '../../../../shared/components/modal-car-informations/modal-car-informations';
import { Trip } from '../../../../core/models/trip.model';
import { Car } from '../../../../core/models/car.model';
import { CarService } from '../../../../core/services/car';

@Component({
  selector: 'app-carpooling-details-modal',
  imports: [ModalParticipantsInformations, ModalCarInformations],
  templateUrl: './carpooling-details-modal.html',
  styleUrl: './carpooling-details-modal.css'
})
export class CarpoolingDetailsModal {
  @ViewChild('carpoolingDetailsModal') myDialog!: ElementRef<HTMLDialogElement>;

  tripDetails = input<Trip | undefined>();
  // Le signal pour stocker l'objet Car à passer
  carForModalCarInfos = signal<Car | undefined>(undefined);

    constructor() {
    effect(() => {
      const currentTrip = this.tripDetails();
      if (currentTrip?.car) {
        this.carForModalCarInfos.set(currentTrip.car);
      } else {
        this.carForModalCarInfos.set(undefined);
      }
    });
  }

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
