import { Component } from '@angular/core';
import { Informations } from '../informations/informations';
import { NextCarpools } from '../next-carpools/next-carpools';
import { Notifications } from '../notifications/notifications';
import { OldCarpools } from '../old-carpools/old-carpools';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth';
import { Car } from '../../../core/models/car.model';
import { Reservation } from '../../../core/models/reservation.model';
import { ReservationService } from '../../../core/services/reservation';
import { CarService } from '../../../core/services/car';

@Component({
  selector: 'app-profile',
  imports: [Informations, NextCarpools, Notifications, OldCarpools],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  host: {
    class: 'flex-1 flex flex-col mx-auto w-[95%]',
  },
})
export class Profile {
  user!: User | null;
  userPersonalCars: Car[] = [];

  constructor(
    private authService: AuthService,
    private carService: CarService,
  ) {}

  ngOnInit() {
    // On s'abonne à l'Observable de l'utilisateur pour être notifié des changements (connexion/déconnexion)
    this.authService.user$.subscribe({
      next: (user) => {
        this.user = user;
        if (user) {
          this.loadPersonalCars(user.id);
        } else {
          this.userPersonalCars = [];
        }
      },
      error: (err) => {
        console.error(
          'Erreur critique lors de la souscription au statut de l’utilisateur :',
          err
        );
        this.user = null;
        this.userPersonalCars = [];
      },
    });
  }

  loadPersonalCars(userId: number): void {
    this.carService.getCarsByUserId(userId).subscribe({
      next: (cars) => {
        this.userPersonalCars = cars;
        console.log('[Profile Component] Voitures personnelles chargées :', this.userPersonalCars);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des voitures personnelles :', err);
      }
    });
  }

}
