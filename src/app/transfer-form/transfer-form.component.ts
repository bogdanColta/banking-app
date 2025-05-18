import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {DataService} from '../data-service/data.service';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';

@Component({
    selector: 'app-transfer-form',
    templateUrl: './transfer-form.component.html',
  imports: [
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    CurrencyPipe
  ],
    styleUrls: ['./transfer-form.component.css']
})
export class TransferFormComponent {
  transactionForm: FormGroup;
  data: any;
  ibans: string[] = [];
  bankAccounts: any[] = [];
  currentIban: string | null = null;
  currentBalance: number | null = null;

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router) {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.pattern('^\\d+(\\.\\d{1,2})?$')]],
      senderIBAN: ['', [Validators.required]],
      receiverIBAN: ['', [Validators.required, Validators.pattern('^[A-Z0-9]*$')]],
      receiverName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.dataService.getBankAccounts().subscribe(
      (response) => {
        this.bankAccounts = response;
        this.ibans = response.map((account: any) => account.iban);
        this.transactionForm.get('senderIBAN')?.valueChanges.subscribe(() => {
          this.updateCurrent();
        });
        if (this.ibans.length > 0) {
          this.transactionForm.get('senderIBAN')?.setValue(this.ibans[0]);
        }
      },
      (error) => {
        console.error('Error fetching IBANs', error);
      }
    );
  }

  updateCurrent(): void {
    const selectedIban = this.transactionForm.get('senderIBAN')?.value;
    const account = this.bankAccounts.find(acc => acc.iban === selectedIban);
    if (account) {
      this.currentIban = account.iban;
      this.currentBalance = account.balance;
    } else {
      this.currentIban = null;
      this.currentBalance = null;
    }
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.dataService.postTransaction(this.transactionForm.value).subscribe(
        (response) => {
          console.log('Data posted successfully');
          this.router.navigate(['/successful-transaction']);
        },
        (error) => {
          const errorMessage = error.error["Error Message"];
          this.router.navigate(['/unsuccessful-transaction'], {
            queryParams: {
              error: errorMessage
            }
          });
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
