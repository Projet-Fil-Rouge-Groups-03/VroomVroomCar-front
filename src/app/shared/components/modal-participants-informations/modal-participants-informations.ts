import { Component, input } from '@angular/core';

@Component({
  selector: 'app-modal-participants-informations',
  imports: [],
  templateUrl: './modal-participants-informations.html',
  styleUrl: './modal-participants-informations.css'
})
export class ModalParticipantsInformations {
  participants = input<string>('Didier Mazier');
}
