import { Component } from '@angular/core';
import {DataService} from '../data-service/data.service';
import {Router} from '@angular/router';
import {groupBy} from 'lodash';
import {CurrencyPipe, KeyValuePipe, NgClass, NgForOf} from '@angular/common';

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
  selector: 'app-income-transactions',
  imports: [
    CurrencyPipe,
    KeyValuePipe,
    NgForOf,
    NgClass
  ],
  templateUrl: './income-transactions.component.html',
  styleUrl: './income-transactions.component.css'
})
export class IncomeTransactionsComponent {
  groupedTransactions: { [key: string]: Transaction[] } = {};
  name: string = '';
  iban: string = '';
  startDate: string = '';
  endDate: string = '';
  type : string = '';
  inTransactions: Transaction[] = [];
  outTransactions: Transaction[] = [];
  transactions: Transaction[] = [];

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.router.routerState.root.queryParams.subscribe(params => {
      this.startDate = params['startDate'] || '';
      this.endDate = params['endDate'] || '';
      this.iban = params['iban'] || '';
      this.type = params['type'] || '';
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

    this.dataService.getInsightsInAndOutTransactions(this.iban, this.startDate, this.endDate).subscribe(
      (response: any) => {
        this.inTransactions = response.inTransactions;
        this.outTransactions = response.outTransactions;
        this.groupTransactionsByDate();
      },
      (error) => {
        console.error('Error fetching in/out transactions', error);
      }
    )
  }

  viewTransactionDetails(transaction: Transaction, iban: string): void {
    this.router.navigate(['/transaction-details', transaction.id], { queryParams: { iban } });
  }

  groupTransactionsByDate(): void {
    if (this.type === 'in') {
      this.transactions = this.inTransactions;
    }else {
      this.transactions = this.outTransactions;
    }
    this.groupedTransactions = groupBy(this.transactions, (transaction: Transaction) =>
      new Date(transaction.date).toDateString()
    );
  }

  compareDatesDesc = (a: {key: string}, b: {key: string}) => {
    return new Date(b.key).getTime() - new Date(a.key).getTime();
  };

  getCategoryIcon(category: string): string {
    const categoryIcons: { [key: string]: string } = {
      Electricity: 'bi bi-lightning',
      Gas: 'bi bi-fire',
      Fuel: 'bi bi-fuel-pump',
      Train: 'bi bi-train-front',
      Bus: 'bi bi-bus-front',
      Taxi: 'bi bi-taxi-front',
      Clothes: 'bi bi-bag',
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
