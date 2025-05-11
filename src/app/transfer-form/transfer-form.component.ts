import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {DataService} from '../data-service/data.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
    selector: 'app-transfer-form',
    templateUrl: './transfer-form.component.html',
    imports: [
        NgIf,
        NgForOf,
        ReactiveFormsModule
    ],
    styleUrls: ['./transfer-form.component.css']
})
export class TransferFormComponent {
  transactionForm: FormGroup;
  data: any;
  ibans: string[] = [];

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router) {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      senderIBAN: ['', [Validators.required]],
      receiverIBAN: ['', [Validators.required, Validators.pattern('^[A-Z0-9]*$')]]
    });
  }

  ngOnInit(): void {
    this.dataService.getBankAccounts().subscribe(
      (response) => {
        this.ibans = response.map((account: any) => account.iban);
        console.log('IBANs fetched successfully', this.ibans);
      },
      (error) => {
        console.error('Error fetching IBANs', error);
      }
    );
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.transactionForm.value.date = new Date();
      this.dataService.postTransaction(this.transactionForm.value).subscribe(
        (response) => {
          console.log('Data posted successfully', response);
          this.router.navigate(['/successful-transaction']);
        },
        (error) => {
          console.log(error);
          console.error('Error posting data', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  goBack(): void {
    window.history.back();
  }
}
