import { Component } from '@angular/core';
// En tu componente.ts
import 'jquery';
import 'popper.js';
import 'bootstrap';

// ...

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'IngresoPc';
}

