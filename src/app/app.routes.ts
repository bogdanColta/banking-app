import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {InsightsComponent} from './insights/insights.component';
import {MainComponent} from './main/main.component';
import {ProductComponent} from './product/product.component';
import {SettingsComponent} from './settings/settings.component';
import {TransactionsComponent} from './transactions/transactions.component';
import {IbanDetailsComponent} from './iban-details/iban-details.component';
import {TransactionDetailsComponent} from './transaction-details/transaction-details.component';
import {TransferFormComponent} from './transfer-form/transfer-form.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'insights',
    component: InsightsComponent
  },
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'transactions',
    component: TransactionsComponent
  },
  {
    path: 'iban-details/:iban',
    component: IbanDetailsComponent
  },
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full'
  },
  {
    path: 'transaction-details/:id',
    component: TransactionDetailsComponent
  },
  {
    path: 'transfer-form',
    component: TransferFormComponent
  }
];
