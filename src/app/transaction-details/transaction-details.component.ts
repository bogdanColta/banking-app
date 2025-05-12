import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data-service/data.service';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';

@Component({
    selector: 'app-transaction-details',
    templateUrl: './transaction-details.component.html',
  imports: [
    CurrencyPipe,
    NgIf,
    NgForOf
  ],
    styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {
  categories: string[] = [
    'Electricity',
    'Gas',
    'Train',
    'Bus',
    'Clothes',
    'Groceries',
    'Electronics',
    'Furniture',
    'Banking',
    'Insurance',
    'Education',
    'Other'
  ];
  transaction: any;
  iban: any;

  constructor(private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit(): void {
    const transactionId = this.route.snapshot.paramMap.get('id');
    this.iban = this.route.snapshot.queryParamMap.get('iban'); // Retrieve the iban
    this.dataService.getTransactionById(transactionId).subscribe(
      (response) => {
        this.transaction = response;
        console.log('Transaction details fetched successfully', this.transaction);
      },
      (error) => {
        console.error('Error fetching transaction details', error);
      }
    );
  }

  goBack(): void {
    window.history.back();
  }

  parseDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    };
    return new Date(date).toLocaleString(undefined, options);
  }

  selectCategory(category: string): void {
    const data = {
      id: this.transaction.id,
      category: category,
    };

    this.dataService.setCategory(data).subscribe(
      (response) => {
        this.transaction.category = category;
        console.log('Data posted successfully', response);
      },
      (error) => {
        console.log(error);
        console.error('Error posting data', error);
      }
    );
  }
}
