import { Component, computed, effect, input } from '@angular/core';
import { Car } from '../../../core/models/car.model';

@Component({
  selector: 'app-modal-car-informations',
  imports: [],
  templateUrl: './modal-car-informations.html',
  styleUrl: './modal-car-informations.css'
})
export class ModalCarInformations {

  car = input<Car | undefined>();

  marque = computed(() => this.car()?.marque ?? 'Marque inconnue');
  modele = computed(() => this.car()?.modele ?? 'Modèle inconnu');
  nbDePlaces = computed(() => this.car()?.nbDePlaces ?? 0); 
  motorisation = computed(() => this.car()?.motorisation ?? 'Motorisation inconnue');
  categorie = computed(() => this.car()?.categorie ?? 'Catégorie inconnue');
  pollution = computed(() => this.car()?.pollution ?? 'Pollution inconnue');

  constructor() {
    effect(() => {
      const currentCar = this.car();
      if (currentCar) {
        console.log('ModalCarInformations a reçu la voiture:', currentCar.marque, currentCar.modele);
      } else {
        console.log('ModalCarInformations: Pas de voiture reçue ou réinitialisée.');
      }
    });
  }
}
