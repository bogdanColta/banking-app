import { Component, OnInit } from '@angular/core';
import {FormGroup, ReactiveFormsModule, Validators, FormBuilder} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {DataService} from '../data-service/data.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: 'transactions.component.html',
  styleUrl: 'transaction-form.component.css'
})
export class TransactionsComponent implements OnInit {
  transactionForm: FormGroup;
  data: any;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      receiverIBAN: ['', [Validators.required, Validators.pattern('^[A-Z0-9]*$')]]
    });
  }

  ngOnInit(): void {
    this.dataService.getTransactions().subscribe(
      (response) => {
        this.data = response;
        console.log('Data fetched successfully', this.data);
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.transactionForm.value.senderIBAN = "2"
      this.transactionForm.value.date = new Date();
      this.dataService.postTransaction(this.transactionForm.value).subscribe(
        (response) => {
          console.log('Data posted successfully', response);
          this.ngOnInit();
        },
        (error) => {
          console.error('Error posting data', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
