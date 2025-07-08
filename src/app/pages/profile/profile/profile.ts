import { Component } from '@angular/core';
import { Informations } from "../informations/informations";
import { NextCarpools } from "../next-carpools/next-carpools";
import { Notifications } from "../notifications/notifications";
import { OldCarpools } from "../old-carpools/old-carpools";
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth';

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

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.authService.user$.subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l’utilisateur :', err);
      }
    });
  }
}
