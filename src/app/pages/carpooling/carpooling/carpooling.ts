import { Component } from '@angular/core';
import { CarpoolingList } from '../carpooling-list/carpooling-list';
import { AdCorner } from '../ad-corner/ad-corner';

@Component({
  selector: 'app-carpooling',
  imports: [CarpoolingList, AdCorner],
  templateUrl: './carpooling.html',
  styleUrl: './carpooling.css',
    host: {
    class: 'flex-1 flex flex-col lg:flex-row lg:pt-8',
  },
})
export class Carpooling {

}
