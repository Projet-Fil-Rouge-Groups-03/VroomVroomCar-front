import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { Subscribe } from '../../../core/models/subscribe.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-participants-informations',
  imports: [],
  templateUrl: './modal-participants-informations.html',
  styleUrl: './modal-participants-informations.css'
})
export class ModalParticipantsInformations{
  participants = input<Subscribe[] | undefined>();

  participantNames = computed<string[]>(() => {
    const subs = this.participants();

    if (!subs || subs.length === 0) {
      console.warn("Enfant - computed() - Aucun participant trouvé depuis input");
      return [];
    }

    const names = subs.map(sub => `${sub.prenom} ${sub.nom}`);
    return names;
  });

  private destroy$ = new Subject<void>();

  constructor() {}
}