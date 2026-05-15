import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyCarCard } from '../company-car-card/company-car-card';
import { CompanyCar } from '../../../core/models/company-car.model';

@Component({
  selector: 'app-company-car-carousel',
  standalone: true,
  imports: [CommonModule, CompanyCarCard],
  templateUrl: './company-cars-carousel.html',
  styleUrls: ['./company-cars-carousel.css'],
})
export class CompanyCarsCarousel {
  @Input() cars: CompanyCar[] = [];
  @Output() carSelected = new EventEmitter<CompanyCar>();

  currentIndex = 0;
  readonly visibleCount = 3;

  get canPrev(): boolean {
    return this.currentIndex > 0;
  }

  get canNext(): boolean {
    return this.currentIndex + this.visibleCount < this.cars.length;
  }

  get visibleCars(): CompanyCar[] {
    return this.cars.slice(this.currentIndex, this.currentIndex + this.visibleCount);
  }

  get totalPages(): number {
    return Math.max(1, this.cars.length - this.visibleCount + 1);
  }

  prev(): void {
    if (this.canPrev) this.currentIndex--;
  }

  next(): void {
    if (this.canNext) this.currentIndex++;
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }

  onCardClicked(car: CompanyCar): void {
    this.carSelected.emit(car);
  }
}