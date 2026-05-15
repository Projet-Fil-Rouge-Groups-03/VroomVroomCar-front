import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
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
export class CompanyCarDetailsModal implements OnInit {
  @Input() car!: CompanyCar;
  @Output() closed = new EventEmitter<void>();
  @Output() reserved = new EventEmitter<ReservationRequest>();

  VehiculeStatus = VehiculeStatus;
  Motorisation = Motorisation;
  form!: FormGroup<any>;
  fb = inject(FormBuilder);
  authService = inject(AuthService)

  ngOnInit(): void {
    this.form = this.fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      villeDepart: [''],
      lieuDepart: [''],
      villeArrivee: [''],
      lieuArrivee: [''],
      covoiturage: [false],
    });
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

    this.reserved.emit(request);
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}