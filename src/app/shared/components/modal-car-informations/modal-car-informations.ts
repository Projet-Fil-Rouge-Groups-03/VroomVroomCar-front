import { Component, input } from '@angular/core';

@Component({
  selector: 'app-modal-car-informations',
  imports: [],
  templateUrl: './modal-car-informations.html',
  styleUrl: './modal-car-informations.css'
})
export class ModalCarInformations {

  marque = input<string>('Toyota');
  modele = input<string>('Yaris');
  nbDePlaces = input<string>('');
  motorisation = input<string>('Hybride');
  categorie = input<string>('Citadine Polyvalente');
  pollution = input<string>('9.02 CO²/km');

}
