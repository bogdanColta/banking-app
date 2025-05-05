import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private headers: HttpHeaders;
  private url = 'http://localhost:8080/';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'XSRF-TOKEN': this.getCsfrToken(),
    });
  }

  getCsfrToken() {
    let token = "";
    if (isPlatformBrowser(this.platformId)) {
      document.cookie.split(';').forEach((cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        if (name === 'XSRF-TOKEN') {
          token = value;
        }
      });
    }
    return token;
  }

  getTransactions(param: any): Observable<any> {
    return this.http.get(this.url + 'transactions?iban=' + param);
  }

  postTransaction(data: any): Observable<any> {
    return this.http.post(this.url + 'transactions', data);
  }

  setHeader(name: string, value: string): void {
    this.headers.set(name, value);
    console.log(this.headers);
  }

  login(authHeader: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': authHeader
    });
    return this.http.get(this.url + 'customers/login', { headers }).pipe(
      tap(() => {
        this.router.navigate(['/main']);
      })
    );
  }

  getBankAccounts(): Observable<any> {
    return this.http.get(this.url + 'customers/bankaccounts');
  }

  getCustomerData(): Observable<any> {
    return this.http.get(this.url + 'customers');
  }

  getTransactionById(id: any): Observable<any> {
    return this.http.get(this.url + 'transactions/transaction?id=' + id);
  }
}
