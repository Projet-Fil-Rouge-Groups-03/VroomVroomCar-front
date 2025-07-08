import { Component, effect, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { ModalParticipantsInformations } from '../../../../shared/components/modal-participants-informations/modal-participants-informations';
import { ModalCarInformations } from '../../../../shared/components/modal-car-informations/modal-car-informations';
import { Trip } from '../../../../core/models/trip.model';
import { Car } from '../../../../core/models/car.model';
import { Subscribe } from '../../../../core/models/subscribe.model';
import { SubscribeService } from '../../../../core/services/subscribe';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-carpooling-details-modal',
  imports: [ModalParticipantsInformations, ModalCarInformations],
  templateUrl: './carpooling-details-modal.html',
  styleUrl: './carpooling-details-modal.css'
})
export class CarpoolingDetailsModal {
  @ViewChild('carpoolingDetailsModal') myDialog!: ElementRef<HTMLDialogElement>;

  organizer = input<string>('Jean Dupont');

  tripDetails = input<Trip | undefined>();
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
        this.subscribeService.findByTrip(currentTrip.id)
          .pipe(
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: (data) => {
              this.subscribers.set(data);
            },
            error: (err) => {
              console.error("Erreur lors de la récupération des participants", err);
              this.subscribers.set([]);
            }
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

