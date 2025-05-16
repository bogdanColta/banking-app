import {Component} from '@angular/core';
import {DataService} from '../data-service/data.service';
import {AuthService} from '../auth-service/auth.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrls: ['./login.component.css'],
  templateUrl: `./login.component.html`,
  styles: []
})
export class LoginComponent {
  constructor(private authService: AuthService, private dataService: DataService) {}

  pin: number[] = [];
  maxPinLength = 5;
  username: string | null = null;
  errorMessage: string = '';

  pinPadRows = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];

  get pinDots() {
    return Array(this.maxPinLength)
      .fill(false)
      .map((_, i) => i < this.pin.length);
  }

  onNumberClick(num: number) {
    if (this.pin.length < this.maxPinLength) {
      this.pin.push(num);
      if (this.pin.length === this.maxPinLength) {
        this.submitPin();
      }
    }
  }

  onBackspace() {
    this.pin.pop();
  }

  pinToString(): string {
    return this.pin.join('');
  }

  submitPin() {
    this.errorMessage = '';
    const pin = this.pinToString();
    this.username = this.authService.getUsername();
    const authHeader = 'Basic ' + btoa(`${this.username}:${pin}`);
    this.dataService.login(authHeader).subscribe(
      (response) => {
        this.authService.setToken(authHeader);
        this.errorMessage = '';
        // handle successful login
      },
      (error) => {
        this.errorMessage = 'Incorrect PIN';
        this.pin = [];
      }
    );
  }
}
