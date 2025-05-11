import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data-service/data.service';
import { CurrencyPipe, NgClass, NgForOf } from '@angular/common';
import { Router } from '@angular/router';
import { groupBy } from 'lodash';
import { CommonModule } from '@angular/common';

interface Transaction {
  id: string;
  date: string;
  senderIBAN: string;
  receiverIBAN: string;
  amount: number;
  [key: string]: any;
}

@Component({
  selector: 'app-account-details',
  templateUrl: './iban-details.component.html',
  imports: [
    NgForOf,
    CurrencyPipe,
    NgClass,
    CommonModule
  ],
  styleUrls: ['./iban-details.component.css']
})
export class IbanDetailsComponent implements OnInit {
  iban: string | null = null;
  transactions: Transaction[] = [];
  groupedTransactions: { [key: string]: Transaction[] } = {};

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.iban = this.route.snapshot.paramMap.get('iban');
    this.dataService.getTransactions(this.iban).subscribe(
      (response: Transaction[]) => {
        this.transactions = response;
        this.groupTransactionsByDate();
        console.log('Data fetched successfully', this.transactions);
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  groupTransactionsByDate(): void {
    this.groupedTransactions = groupBy(this.transactions, (transaction: Transaction) =>
      new Date(transaction.date).toDateString()
    );
  }

  viewTransactionDetails(transaction: Transaction, iban: string): void {
    this.router.navigate(['/transaction-details', transaction.id], { queryParams: { iban } });
  }

  navigateToTransferForm(): void {
    this.router.navigate(['/transfer-form']);
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
}
