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
  senderName: string;
  receiverName: string;
  amount: number;
  category: string;
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
  name: string | null = null;
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

  groupTransactionsByDate(): void {
    this.groupedTransactions = groupBy(this.transactions, (transaction: Transaction) =>
      new Date(transaction.date).toDateString()
    );
  }

  compareDatesDesc = (a: {key: string}, b: {key: string}) => {
    return new Date(b.key).getTime() - new Date(a.key).getTime();
  };

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
