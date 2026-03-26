import { Component } from '@angular/core';
import { HeroesComponent } from './heroes/heroes.component';
import { InputFormatDirective } from './directives/input-format.directive';

@Component({
  selector: 'app-root',
  imports: [HeroesComponent, InputFormatDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Tour of Heroes';
}
