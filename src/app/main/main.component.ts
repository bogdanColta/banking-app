import { Component, OnInit } from '@angular/core';
import { DataService } from '../data-service/data.service';
import {CurrencyPipe, NgForOf} from '@angular/common';

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

  constructor(private dataService: DataService) {}

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
}
