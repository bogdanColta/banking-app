import { Component } from '@angular/core';
import {CurrencyPipe, KeyValuePipe, NgClass, NgForOf} from '@angular/common';
import {Router} from '@angular/router';
import {DataService} from '../data-service/data.service';
import {groupBy} from 'lodash';

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
  selector: 'app-category-transactions',
  imports: [
    CurrencyPipe,
    KeyValuePipe,
    NgForOf,
    NgClass
  ],
  templateUrl: './category-transactions.component.html',
  styleUrl: './category-transactions.component.css'
})
export class CategoryTransactionsComponent {
  groupedTransactions: { [key: string]: Transaction[] } = {};
  name: string = '';
  iban: string = '';
  transactions: Transaction[] = [];

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.router.routerState.root.queryParams.subscribe(params => {
      this.transactions = params['transactions'] ? JSON.parse(params['transactions']) : [];
      this.iban = params['iban'] || '';
      this.groupTransactionsByDate();
    });

    if (this.iban) {
      this.dataService.getNameAccount(this.iban).subscribe(
        (response: any) => {
          this.name = response.name;
          this.groupTransactionsByDate();
        },
        (error) => {
          console.error('Error fetching account name', error);
        }
      );
    }
  }

  groupTransactionsByDate(): void {
    this.groupedTransactions = groupBy(this.transactions, (transaction: Transaction) =>
      new Date(transaction.date).toDateString()
    );
  }

  viewTransactionDetails(transaction: Transaction, iban: string): void {
    this.router.navigate(['/transaction-details', transaction.id], { queryParams: { iban } });
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

}
