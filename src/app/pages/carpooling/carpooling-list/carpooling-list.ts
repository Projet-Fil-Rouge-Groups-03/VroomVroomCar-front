import { Component } from '@angular/core';
import { CarpoolingCard } from "../carpooling-card/carpooling-card";

@Component({
  selector: 'app-carpooling-list',
  imports: [CarpoolingCard],
  templateUrl: './carpooling-list.html',
  styleUrl: './carpooling-list.css',
  host: {
    class: 'flex-1 flex flex-col',
  },
})
export class CarpoolingList {

}
