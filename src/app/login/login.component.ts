import {Component, OnInit} from '@angular/core';
import {DataService} from '../data-service/data.service';
import {AuthService} from '../auth-service/auth.service';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    NgStyle,
    FormsModule
  ],
  styleUrls: ['./login.component.css'],
  templateUrl: `./login.component.html`,
  styles: []
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private dataService: DataService) {}

  pin: number[] = [];
  maxPinLength = 5;
  username: string | null = null;
  errorMessage: string = '';

  usernames: string[] = [];
  selectedUsername: string = '';
  showProfileModal = false;
  newUsername: string = '';

  pinPadRows = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];

  ngOnInit(): void {
    const stored = this.authService.getUsernames();;
    this.usernames = stored ? JSON.parse(stored) : [];
    this.selectedUsername = this.usernames[0] || '';
    this.username = this.selectedUsername;
  }

  openProfileModal() {
    this.showProfileModal = true;
    this.newUsername = '';
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  selectProfile(username: string) {
    this.selectedUsername = username;
    this.username = username;
    this.closeProfileModal();
  }

  addUsername() {
    const trimmed = this.newUsername.trim();
    if (trimmed && !this.usernames.includes(trimmed)) {
      this.usernames.push(trimmed);
      localStorage.setItem('usernames', JSON.stringify(this.usernames));
      this.selectedUsername = trimmed;
      this.username = trimmed;
      this.newUsername = '';
      this.closeProfileModal();
    }
  }

  removeUsername(user: string) {
    this.usernames = this.usernames.filter(u => u !== user);
    localStorage.setItem('usernames', JSON.stringify(this.usernames));
    if (this.selectedUsername === user) {
      this.selectedUsername = this.usernames[0] || '';
      this.username = this.selectedUsername;
    }
  }

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
    this.username = this.selectedUsername;
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

  onModalBackgroundClick(event: MouseEvent) {
    // Only close if the click is on the modal background, not the dialog
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeProfileModal();
    }
  }
}
