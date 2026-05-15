import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyCarFilter } from '../company-car-filter/company-car-filter';
import { CompanyCarsCarousel } from '../company-cars-carousel/company-cars-carousel';
import { CompanyCarDetailsModal } from '../modals/company-car-details-modal/company-car-details-modal';
import { CompanyCar, VehiculeStatus } from '../../../core/models/company-car.model';
import { CompanyCarService } from '../../../core/services/company-car';
import { AuthService } from '../../../core/services/auth';
import { ReservationService } from '../../../core/services/reservation';
import { ReservationRequest } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-company-car',
  standalone: true,
  imports: [
    CommonModule,
    CompanyCarFilter,
    CompanyCarsCarousel,
    CompanyCarDetailsModal,
  ],
  templateUrl: './company-cars.html',
  styleUrls: ['./company-cars.css'],
})
export class CompanyCars implements OnInit {
  allCars: CompanyCar[] = [];
  filteredCars: CompanyCar[] = [];
  selectedCar: CompanyCar | null = null;
  reservationService = inject(ReservationService)
  authService = inject(AuthService)

  ngOnInit(): void {
    this.reservationService.getAllAvailableCars().subscribe((cars: CompanyCar[]) => {
      this.allCars = cars;
      this.filteredCars = [...this.allCars];
    })
  }

  onFiltersChanged(filtered: CompanyCar[]): void {
    this.filteredCars = filtered;
  }

  onCarSelected(car: CompanyCar): void {
    if(car === null || car === undefined) return
    console.log(car.modele + "" + car.marque + " a été sélectionnée")
    this.selectedCar = car;
    console.log('after assign', this.selectedCar);
  }

  onModalClosed(): void {
    this.selectedCar = null;
  }

  onCarReserved(reservation: ReservationRequest): void {
    console.log('Réservation pour :', reservation);
    this.reservationService.createReservation(reservation).subscribe(reservation => console.log("Rservation effectuée :", reservation));
    this.selectedCar = null;
  }
}