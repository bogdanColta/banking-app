import { Component } from '@angular/core';
import {FormGroup, ReactiveFormsModule, Validators, FormBuilder} from '@angular/forms';
import {NgIf} from '@angular/common';
import {DataService} from '../data-service/data.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: 'transactions.component.html',
  styleUrl: 'transaction-form.component.css'
})
export class TransactionsComponent {
  transactionForm: FormGroup;
  data: any;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      iban: ['', [Validators.required, Validators.pattern('^[A-Z0-9]*$')]]
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      console.log('Form Submitted', this.transactionForm.value);
      this.dataService.getTransactions().subscribe(
        (response) => {
          this.data = response;
          console.log('Data fetched successfully', this.data);
        },
        (error) => {
          console.error('Error fetching data', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
