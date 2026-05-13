import { Component, computed, effect, ElementRef, HostListener, inject, input, OnDestroy, OnInit, output, signal, ViewChild } from '@angular/core';
import { ModalParticipantsInformations } from '../../../../shared/components/modal-participants-informations/modal-participants-informations';
import { ModalCarInformations } from '../../../../shared/components/modal-car-informations/modal-car-informations';
import { Trip } from '../../../../core/models/trip.model';
import { Car } from '../../../../core/models/car.model';
import { Subscribe, SubscribeRequest } from '../../../../core/models/subscribe.model';
import { SubscribeService } from '../../../../core/services/subscribe';
import { Subject, takeUntil } from 'rxjs';
import { Reservation } from '../../../../core/models/reservation.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-carpooling-details-modal',
  imports: [ModalParticipantsInformations, ModalCarInformations, CommonModule],
  templateUrl: './carpooling-details-modal.html',
  styleUrl: './carpooling-details-modal.css',
})
export class CarpoolingDetailsModal implements OnDestroy, OnInit {
  @ViewChild('carpoolingDetailsModal') myDialog!: ElementRef<HTMLDialogElement>;

  mode = input<'booking' | 'view-only'>('booking');
  organizer = input<string>('Organisateur inconnu');
  user = inject(AuthService).currentUser;
  unavailable : boolean = true;
  tripDetails = input<Trip | Reservation | undefined>();
  carForModalCarInfos = signal<Car | undefined>(undefined);
  subscribers = signal<Subscribe[]>([]);

  isTooltipVisible = signal(false);

  private destroy$ = new Subject<void>();

  constructor(private readonly subscribeService: SubscribeService, private elRef: ElementRef ) {
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
  ngOnInit() {
    if(this.tripDetails()?.dateFin == null) return true;
    var str = this.tripDetails()!.dateFin;
    this.unavailable = new Date(str) < new Date()
    return;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // === BOUTON RESERVATION (non fini)===
  addSubscribe() {
    if(!this.user) {
      console.log("User invalide")
      return;
    } 
    const currentTrip = this.tripDetails();
    if (currentTrip?.id) {
      if(this.subscribeService.findByTrip(currentTrip.id)){
        const subscribeRequest : SubscribeRequest = {
          userId : this.user.id,
          tripId : currentTrip.id,
        };
        console.log("User " + this.user.nom + " a réservé le voyage " + currentTrip.id)
        this.subscribeService.create(subscribeRequest)
          .subscribe((value : Subscribe) =>{
            console.log("User " + value.prenom + " " + value.nom + " est inscrit au voyage " + value.tripId);
            this.closeModal()
          });
      }
    }
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

  toggleTooltip(event: MouseEvent): void {
    event.stopPropagation(); 
    this.isTooltipVisible.update(visible => !visible);
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isTooltipVisible() && !this.elRef.nativeElement.contains(event.target)) {
      this.isTooltipVisible.set(false);
    }
  }
}
