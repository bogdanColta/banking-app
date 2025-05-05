import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data-service/data.service';
import {CurrencyPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  templateUrl: './transaction-details.component.html',
  imports: [
    CurrencyPipe,
    NgIf
  ],
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {
  transaction: any;

  constructor(private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit(): void {
    const transactionId = this.route.snapshot.paramMap.get('id');
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
}
