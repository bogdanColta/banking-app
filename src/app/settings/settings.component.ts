import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../data-service/data.service';
import {AuthService} from '../auth-service/auth.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  userName: string = '';

  constructor(private router: Router, private dataService: DataService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.dataService.getCustomerData().subscribe(
      (response: any) => {
        this.userName = response.legalName;
      },
      (error) => {
        console.error('Error fetching user data', error);
      }
    );
  }

  logout(): void {
    console.log('User logged out');
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }

  settings = [
    {label: 'Documents', link: '/documents'},
    {label: 'Access Security and Privacy', link: '/access-security-privacy'},
    {label: 'Payment Accounts', link: '/payment-accounts'},
    {label: 'Debit Cards', link: '/debit-cards'},
    {label: 'Credit Cards', link: '/credit-cards'},
    {label: 'Notifications', link: '/notifications'}
  ];

  icons = [
    'fas fa-file-alt',
    'fas fa-lock',
    'fas fa-university',
    'fas fa-credit-card',
    'fas fa-credit-card',
    'fas fa-bell'
  ];
}
