import {Component} from '@angular/core';
import {NgForOf} from '@angular/common';
import {AuthService} from '../auth-service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './product.component.html',
  imports: [
    NgForOf,
  ],
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  products: string[] = ['Payments and cards', 'Saving', 'Investing', 'Mortgage', 'Lending', 'Insurances'];
  icons: string[] = [
    'fas fa-credit-card', // Payments and Cards
    'fas fa-piggy-bank',  // Saving
    'fas fa-chart-line',  // Investing
    'fas fa-home',        // Mortgage
    'fas fa-hand-holding-usd', // Lending
    'fas fa-shield-alt'   // Insurances
  ];

  logout(): void {
    console.log('User logged out');
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }

  constructor(private authService: AuthService, private router: Router) {
  }
}
