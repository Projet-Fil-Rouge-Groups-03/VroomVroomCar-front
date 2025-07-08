import { Component } from '@angular/core';
import { Informations } from "../informations/informations";
import { NextCarpools } from "../next-carpools/next-carpools";
import { Notifications } from "../notifications/notifications";
import { OldCarpools } from "../old-carpools/old-carpools";

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
  
}
