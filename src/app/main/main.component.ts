import {Component, OnInit} from '@angular/core';
import {DataService} from '../data-service/data.service';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../auth-service/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [
    NgForOf,
    CurrencyPipe
  ]
})
export class MainComponent implements OnInit {
  bankAccounts: any[] = [];

  constructor(private dataService: DataService, private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.dataService.getBankAccounts().subscribe(
      (data) => {
        this.bankAccounts = data;
        console.log(this.bankAccounts);
      },
      (error) => {
        console.error('Error fetching bank accounts:', error);
      }
    );
  }

  logout(): void {
    console.log('User logged out');
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }

  viewAccountDetails(iban: string): void {
    this.router.navigate(['/iban-details', iban]);
  }

  navigateToTransferForm(): void {
    this.router.navigate(['/transfer-form']);
  }

  totalAmount(): number {
    return this.bankAccounts?.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0) || 0;
  }
}
