import {Component, OnInit} from '@angular/core';
import {FormsModule,} from '@angular/forms';
import {Chart, ChartDataset, ChartOptions, ChartType, registerables} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {DataService} from '../data-service/data.service';
import {CurrencyPipe, NgForOf, CommonModule} from '@angular/common';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-insights',
  imports: [
    FormsModule,
    BaseChartDirective,
    NgForOf,
    CurrencyPipe,
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: './insights.component.html'
})
export class InsightsComponent implements OnInit {
  formData = {
    iban: '',
    startDate: '',
    endDate: '',
    periodBin: 'month'
  };

  constructor(private dataService: DataService, private datePipe: DatePipe, private router: Router) {
  }

  ibans: string[] = [];
  inAmount: number = 0;
  outAmount: number = 0;
  totalAmount: number = 0;

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        ticks: {
          maxTicksLimit: 5,
          // source: 'data',
        },
        grid: {
          display: false,
        }
      },
      y: {
        ticks: {
          maxTicksLimit: 2,
        },
        grid: {
          display: false
        }
      }
    }
  };

  public lineChartData: ChartDataset<'line'>[] = [];
  public lineChartLabels: string[] = [];
  public lineChartLegend = false;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  ngOnInit() {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    this.formData.startDate = this.datePipe.transform(startOfMonth, 'yyyy-MM-dd') || '';
    this.formData.endDate = this.datePipe.transform(endOfMonth, 'yyyy-MM-dd') || '';

    this.dataService.getBankAccounts().subscribe(
      (response) => {
        this.ibans = response.map((account: any) => account.iban);
        console.log('IBANs fetched successfully', this.ibans);
        if (this.ibans.length > 0) {
          this.formData.iban = this.ibans[0];
        }
        this.onFormChange();
      },
      (error) => {
        console.error('Error fetching IBANs', error);
      }
    );
  }

  onFormChange() {
    const {iban, startDate, endDate, periodBin} = this.formData;
    if (iban && startDate && endDate && periodBin) {
      this.dataService.getInsightsForAmountSpent(iban, startDate, endDate, periodBin).subscribe(
        (response) => {
          this.lineChartData = [
            {
              data: Object.values(response),
              borderWidth: 3,
              pointRadius: 10,
              pointHoverRadius: 15,
            }
          ];
          this.lineChartLabels = Object.keys(response);
        },
        (error) => {
          console.error('Error fetching insights', error);
        }
      );
      this.dataService.getInsightsInAndOutAmounts(iban, startDate, endDate).subscribe(
        (response: { inAmount: number; outAmount: number }) => {
          this.inAmount = response.inAmount;
          this.outAmount = response.outAmount;
          this.totalAmount = this.inAmount + this.outAmount;
        },
        (error) => {
          console.error('Error fetching amounts', error);
        }
      );
    }
  }

  getInAmountPercentage(): number {
    return this.totalAmount ? (this.inAmount / this.totalAmount) * 100 : 0;
  }

  getOutAmountPercentage(): number {
    return this.totalAmount ? (this.outAmount / this.totalAmount) * 100 : 0;
  }

  redirectToFootprint(): void {
    this.router.navigate(['/footprint'], {
      queryParams: {
        startDate: this.formData.startDate,
        endDate: this.formData.endDate,
        iban: this.formData.iban,
        periodBin: this.formData.periodBin
      }
    });
  }

  redirectToIncomeTransactions(type: 'in' | 'out'): void {
    this.router.navigate(['/income-transactions'], {
      queryParams: {
        startDate: this.formData.startDate,
        endDate: this.formData.endDate,
        iban: this.formData.iban,
        periodBin: this.formData.periodBin,
        type: type
      }
    });
  }
}
