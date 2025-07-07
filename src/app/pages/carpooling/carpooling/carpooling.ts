import { Component } from '@angular/core';
import { CarpoolingList } from '../carpooling-list/carpooling-list';

@Component({
  selector: 'app-carpooling',
  imports: [CarpoolingList],
  templateUrl: './carpooling.html',
  styleUrl: './carpooling.css',
    host: {
    class: 'flex-1 flex flex-col',
  },
})
export class Carpooling {

}
