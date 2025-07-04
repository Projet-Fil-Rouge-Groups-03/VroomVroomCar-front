import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [Hero, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {

}
