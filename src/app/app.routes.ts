import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {InsightsComponent} from './insights/insights.component';
import {MainComponent} from './main/main.component';
import {ProductComponent} from './product/product.component';
import {SettingsComponent} from './settings/settings.component';
import {IbanDetailsComponent} from './iban-details/iban-details.component';
import {TransactionDetailsComponent} from './transaction-details/transaction-details.component';
import {TransferFormComponent} from './transfer-form/transfer-form.component';
import {HelpPageComponent} from './help-page/help-page.component';
import {SuccessfulTransactionComponent} from './successful-transaction/successful-transaction.component';
import {FootprintComponent} from './footprint/footprint.component';
import {FootprintTransactionsComponent} from './footprint-transactions/footprint-transactions.component';
import {IncomeTransactionsComponent} from './income-transactions/income-transactions.component';
import {CategoryTransactionsComponent} from './category-transactions/category-transactions.component';
import {UnsuccessfulTransactionComponent} from './unsuccessful-transaction/unsuccessful-transaction.component';

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
    path: 'help',
    component: HelpPageComponent
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
  },
  {
    path: 'successful-transaction',
    component: SuccessfulTransactionComponent
  },
  {
    path: 'footprint',
    component: FootprintComponent
  },
  {
    path: 'footprint-transactions',
    component: FootprintTransactionsComponent
  },
  {
    path: 'income-transactions',
    component: IncomeTransactionsComponent
  },
  {
    path: 'category-transactions',
    component: CategoryTransactionsComponent
  },
  {
    path: 'unsuccessful-transaction',
    component: UnsuccessfulTransactionComponent
  }
];
