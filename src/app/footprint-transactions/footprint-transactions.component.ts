import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CurrencyPipe, KeyValuePipe, NgClass, NgForOf} from '@angular/common';
import {groupBy} from 'lodash';
import {DataService} from '../data-service/data.service';

interface Transaction {
  id: string;
  date: string;
  senderIBAN: string;
  receiverIBAN: string;
  senderName: string;
  receiverName: string;
  amount: number;
  emission : number;
  category: string;
  [key: string]: any;
}

@Component({
  selector: 'app-footprint-transactions',
  templateUrl: './footprint-transactions.component.html',
  imports: [
    NgForOf,
    CurrencyPipe,
    NgClass,
    KeyValuePipe
  ],
  styleUrls: ['./footprint-transactions.component.css']
})
export class FootprintTransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  groupedTransactions: { [key: string]: Transaction[] } = {};
  period: string = '';
  category: string = '';
  iban: string = '';
  name: string = '';

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.router.routerState.root.queryParams.subscribe(params => {
      const transactions = params['transactions'];
      this.transactions = transactions ? JSON.parse(transactions) : [];
      this.period = params['period'] || '';
      this.category = params['category'] || '';
      this.iban = params['iban'] || '';
      this.groupTransactionsByDate();
    });
    this.dataService.getNameAccount(this.iban).subscribe(
      (response: any) => {
        this.name = response.name;
        console.log('Account name fetched successfully', this.name);
      },
      (error) => {
        console.error('Error fetching account name', error);
      }
    )
  }

  viewTransactionDetails(transaction: Transaction, iban: string): void {
    this.router.navigate(['/transaction-details', transaction.id], { queryParams: { iban } });
  }

  groupTransactionsByDate(): void {
    this.groupedTransactions = groupBy(this.transactions, (transaction: Transaction) =>
      new Date(transaction.date).toDateString()
    );
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
