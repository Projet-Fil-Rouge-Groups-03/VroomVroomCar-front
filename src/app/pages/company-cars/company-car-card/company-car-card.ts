import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyCar, VehiculeStatus  } from '../../../core/models/company-car.model';
import { Motorisation } from '../../../core/models/car.model';

@Component({
  selector: 'app-company-car-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-car-card.html',
  styleUrls: ['./company-car-card.css'],
})
export class CompanyCarCard {
  @Input() car!: CompanyCar;
  @Output() cardClicked = new EventEmitter<CompanyCar>();

  VehiculeStatus = VehiculeStatus;
  Motorisation = Motorisation;

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

  onClick(): void {
    this.cardClicked.emit(this.car);
  }
}