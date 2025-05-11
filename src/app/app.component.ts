import { Component } from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import {NgIf} from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgIf, RouterLinkActive],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'banking-app';

  constructor(public router: Router) { }

}
