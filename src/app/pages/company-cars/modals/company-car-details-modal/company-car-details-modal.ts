import { Component, Input, Output, EventEmitter, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motorisation } from '../../../../core/models/car.model';
import { CompanyCar, VehiculeStatus,} from '../../../../core/models/company-car.model';
import { ReservationRequest } from '../../../../core/models/reservation.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-company-car-details-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-car-details-modal.html',
  styleUrl: './company-car-details-modal.css',
})
export class CompanyCarDetailsModal implements OnInit, OnChanges {
  @Input() car!: CompanyCar;
  @Input() existingReservation?: ReservationRequest & { id?: number };
  @Output() closed = new EventEmitter<void>();
  @Output() reserved = new EventEmitter<ReservationRequest>();
  @Output() updated = new EventEmitter<ReservationRequest & { id: number }>();

  VehiculeStatus = VehiculeStatus;
  Motorisation = Motorisation;
  form!: FormGroup<any>;
  fb = inject(FormBuilder);
  authService = inject(AuthService)

  ngOnInit(): void {
    this.form = this.fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      villeDepart: [{ value: '', disabled: true }],
      lieuDepart: [{ value: '', disabled: true }],
      villeArrivee: [{ value: '', disabled: true }],
      lieuArrivee: [{ value: '', disabled: true }],
      covoiturage: [false],
    });

    // Écouter les changements de la checkbox covoiturage
    this.form.get('covoiturage')?.valueChanges.subscribe((isChecked) => {
      if (isChecked) {
        this.form.get('villeDepart')?.enable();
        this.form.get('lieuDepart')?.enable();
        this.form.get('villeArrivee')?.enable();
        this.form.get('lieuArrivee')?.enable();
      } else {
        this.form.get('villeDepart')?.disable();
        this.form.get('lieuDepart')?.disable();
        this.form.get('villeArrivee')?.disable();
        this.form.get('lieuArrivee')?.disable();
      }
    });

    // Si on édite une réservation existante, pré-remplir le formulaire
    this.updateFormWithReservation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Détecter les changements de la réservation à éditer
    if (changes['existingReservation'] && this.form) {
      this.updateFormWithReservation();
    }
  }

  private updateFormWithReservation(): void {
    if (this.existingReservation) {
      // Formater les dates au format yyyy-MM-dd pour les inputs de type date
      const dateDebut = this.formatDateForInput(this.existingReservation.dateDebut);
      const dateFin = this.formatDateForInput(this.existingReservation.dateFin);
      
      this.form.patchValue({
        dateDebut: dateDebut,
        dateFin: dateFin,
      });
      
      console.log('Réservation chargée:', this.existingReservation);
      console.log('Dates formatées - Début:', dateDebut, 'Fin:', dateFin);
    } else {
      // Réinitialiser le formulaire si pas de réservation
      this.form.reset({
        dateDebut: '',
        dateFin: '',
        villeDepart: '',
        lieuDepart: '',
        villeArrivee: '',
        lieuArrivee: '',
        covoiturage: false,
      });
      
      // S'assurer que les champs sont désactivés après le reset
      this.form.get('villeDepart')?.disable();
      this.form.get('lieuDepart')?.disable();
      this.form.get('villeArrivee')?.disable();
      this.form.get('lieuArrivee')?.disable();
    }
  }

  private formatDateForInput(dateString: string): string {
    // Si la date est déjà au format yyyy-MM-dd, la retourner telle quelle
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Sinon, convertir depuis un timestamp ou autre format
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return dateString; // Retourner tel quel si aucun format ne correspond
  }

  getStatusLabel(status: VehiculeStatus): string {
    const labels: Record<VehiculeStatus, string> = {
      [VehiculeStatus.EN_SERVICE]: 'En service',
      [VehiculeStatus.HORS_SERVICE]: 'Hors service',
      [VehiculeStatus.REPARATION]: 'En réparation',
    };
    return labels[status];
  }

  getStatusClass(status: VehiculeStatus): string {
    const classes: Record<VehiculeStatus, string> = {
      [VehiculeStatus.EN_SERVICE]: 'status--active',
      [VehiculeStatus.HORS_SERVICE]: 'status--inactive',
      [VehiculeStatus.REPARATION]: 'status--repair',
    };
    return classes[status];
  }

  getMotorisationIcon(motorisation: Motorisation): string {
    const icons: Record<Motorisation, string> = {
      [Motorisation.ESSENCE]: '⛽',
      [Motorisation.HYBRIDE]: '🔋',
      [Motorisation.ELECTRIQUE]: '⚡',
    };
    return icons[motorisation];
  }

  close(): void {
    this.closed.emit();
  }

  reserve(): void {
    if (this.form.invalid) return;

    const request: ReservationRequest = {
      dateDebut: this.form.value.dateDebut,
      dateFin: this.form.value.dateFin,
      userId: this.authService.currentUser!.id,
      carId: this.car.id,
    };

    // Si on édite une réservation existante
    if (this.existingReservation?.id) {
      this.updated.emit({ ...request, id: this.existingReservation.id });
    } else {
      this.reserved.emit(request);
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}