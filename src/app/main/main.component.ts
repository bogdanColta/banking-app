import { Component, OnInit } from '@angular/core';
import { DataService } from '../data-service/data.service';
import {CurrencyPipe, NgForOf} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  imports: [
    NgForOf,
    CurrencyPipe
  ]
  // styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  bankAccounts: any[] = [];

  constructor(private dataService: DataService, private router: Router) {}

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

  viewAccountDetails(iban: string): void {
    this.router.navigate(['/iban-details', iban]);
  }
}
