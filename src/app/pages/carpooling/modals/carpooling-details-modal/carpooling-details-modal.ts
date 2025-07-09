import { Component, computed, effect, ElementRef, inject, input, OnDestroy, output, signal, ViewChild } from '@angular/core';
import { ModalParticipantsInformations } from '../../../../shared/components/modal-participants-informations/modal-participants-informations';
import { ModalCarInformations } from '../../../../shared/components/modal-car-informations/modal-car-informations';
import { Trip } from '../../../../core/models/trip.model';
import { Car } from '../../../../core/models/car.model';
import { Subscribe, SubscribeRequest } from '../../../../core/models/subscribe.model';
import { SubscribeService } from '../../../../core/services/subscribe';
import { Subject, takeUntil } from 'rxjs';
import { Reservation } from '../../../../core/models/reservation.model';

@Component({
  selector: 'app-carpooling-details-modal',
  imports: [ModalParticipantsInformations, ModalCarInformations],
  templateUrl: './carpooling-details-modal.html',
  styleUrl: './carpooling-details-modal.css',
})
export class CarpoolingDetailsModal implements OnDestroy {
  @ViewChild('carpoolingDetailsModal') myDialog!: ElementRef<HTMLDialogElement>;

  mode = input<'booking' | 'view-only'>('booking');
  organizer = input<string>('Organisateur inconnu');

  tripDetails = input<Trip | Reservation | undefined>();
  carForModalCarInfos = signal<Car | undefined>(undefined);
  subscribers = signal<Subscribe[]>([]);

  private destroy$ = new Subject<void>();

  constructor(private readonly subscribeService: SubscribeService) {
    effect(() => {
      const currentTrip = this.tripDetails();

      if (currentTrip?.car) {
        this.carForModalCarInfos.set(currentTrip.car);
      } else {
        this.carForModalCarInfos.set(undefined);
      }

      if (currentTrip?.id) {
        this.subscribeService
          .findByTrip(currentTrip.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              this.subscribers.set(data);
            },
            error: (err) => {
              console.error(
                'Erreur lors de la récupération des participants',
                err
              );
              this.subscribers.set([]);
            },
          });
      } else {
        this.subscribers.set([]);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // === BOUTON RESERVATION (non fini)===
  addSubscribe() {
    // const currentTrip = this.tripDetails();
    // if (currentTrip?.id) {
    //   if(this.subscribeService.findByTrip(currentTrip.id)){
    //     const subscribeRequest : SubscribeRequest = {
    //       userId = ,
    //       tripId = this.currentTrip.id,
    //     };
    //     this.subscribeService.create(requestSubscribe);
    //   }
    // }
  }

  // === OUVERTURE / FERMETURE DE LA MODALE ===
  closed = output<void>();

openModal() {
    if (this.myDialog && this.myDialog.nativeElement) {
      this.myDialog.nativeElement.showModal();
    }
  }

  closeModal() {
    if (this.myDialog?.nativeElement.open) {
      this.myDialog.nativeElement.close();
      this.closed.emit();
    }
  }

  onDialogClose() {
    this.closed.emit();
  }
}
