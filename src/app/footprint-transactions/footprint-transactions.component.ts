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

  getCategoryIcon(category: string): string {
    const categoryIcons: { [key: string]: string } = {
      Electricity: 'bi bi-lightning',
      Gas: 'bi bi-fire',
      Fuel: 'bi bi-fuel-pump',
      Train: 'bi bi-train-front',
      Bus: 'bi bi-bus-front',
      Taxi: 'bi bi-taxi-front',
      Clothes: 'bi bi-shirt',
      Groceries: 'bi bi-basket',
      Meats: 'bi bi-piggy-bank',
      Vegetables: 'bi bi-leaf',
      Fruits: 'bi bi-apple',
      Dairy: 'bi bi-cup-straw',
      Alcohol: 'bi bi-cup',
      'Soft Drinks': 'bi bi-cup-soda',
      'Paper products': 'bi bi-file-earmark-text',
      'Plastic products': 'bi bi-box',
      Electronics: 'bi bi-phone',
      'Motor vehicles': 'bi bi-car-front',
      Furniture: 'bi bi-house',
      Banking: 'bi bi-bank',
      Insurance: 'bi bi-shield-check',
      Education: 'bi bi-book',
      'Recreational Services': 'bi bi-controller',
      Other: 'bi bi-person-badge-fill'
    };
    if (!category || !categoryIcons[category]) {
      return categoryIcons['Other'];
    }
    return categoryIcons[category];
  }

  compareDatesDesc = (a: {key: string}, b: {key: string}) => {
    return new Date(b.key).getTime() - new Date(a.key).getTime();
  };
}
