import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../data-service/data.service';
import {CurrencyPipe, NgClass, NgForOf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
    selector: 'app-account-details',
    templateUrl: './iban-details.component.html',
    imports: [
        NgForOf,
        CurrencyPipe,
        NgClass
    ],
    styleUrls: ['./iban-details.component.css']
})
export class IbanDetailsComponent implements OnInit {
  iban: string | null = null;
  transactions: any;

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.iban = this.route.snapshot.paramMap.get('iban');
    this.dataService.getTransactions(this.iban).subscribe(
      (response) => {
        this.transactions = response;
        console.log('Data fetched successfully', this.transactions);
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  viewTransactionDetails(transaction: any): void {
    this.router.navigate(['/transaction-details', transaction.id]);
  }

  navigateToTransferForm(): void {
    this.router.navigate(['/transfer-form']);
  }
}

