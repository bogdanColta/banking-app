import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth-service/auth.service';

@Component({
    selector: 'app-help-page',
    imports: [],
    templateUrl: 'help-page.component.html',
    styles: `help-page.component.scss`
})
export class HelpPageComponent {
  constructor(private router: Router, private authService: AuthService) {
  }

  logout(): void {
    console.log('User logged out');
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
