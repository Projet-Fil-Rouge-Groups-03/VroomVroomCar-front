import { Component, input } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth';
import { CarService } from '../../../core/services/car';
import { Car } from '../../../core/models/car.model';

@Component({
  selector: 'app-informations',
  imports: [],
  templateUrl: './informations.html',
  styleUrl: './informations.css'
})
export class Informations {
  user= input<User | null>();
  userCar: Car | null = null
  constructor(private authService: AuthService, private carService: CarService) {}

  ngOnInit() {
    if(this.user()){
      this.carService.getCarsByUserId(this.user()!.id).subscribe({
        next: (car) => this.userCar = car[0],
        error: (err) => {
          console.error('Erreur lors de la récupération de la voiture de l’utilisateur :', err);
        }
      })
    }
      
  }
}
