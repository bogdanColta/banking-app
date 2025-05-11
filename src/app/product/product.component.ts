import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-products',
  templateUrl: './product.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  products: string[] = ['Payments and Cards', 'Saving', 'Investing', 'Mortgage', 'Lending', 'Insurances'];
  icons: string[] = [
    'fas fa-credit-card', // Payments and Cards
    'fas fa-piggy-bank',  // Saving
    'fas fa-chart-line',  // Investing
    'fas fa-home',        // Mortgage
    'fas fa-hand-holding-usd', // Lending
    'fas fa-shield-alt'   // Insurances
  ];

  constructor(private router: Router) {}

  navigateToProduct(product: string): void {
    const route = product.toLowerCase().replace(/ /g, '-');
    this.router.navigate([`/products/${route}`]);
  }
}
