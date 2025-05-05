import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-insights',
  standalone: true,
  templateUrl: './insights.component.html',
  imports: [
    FormsModule
  ],
  // styleUrls: ['./insights.component.css']
})

export class InsightsComponent {
  formData = {
    iban: '',
    startDate: '',
    endDate: '',
    periodBin: 'daily'
  };
  chartData: any;

  onSubmit(): void {
    // Mock data generation for the chart
    this.chartData = this.generateMockData();
    this.renderChart();
  }

  generateMockData(): { labels: string[]; values: number[] } {
    const labels = ['Point 1', 'Point 2', 'Point 3', 'Point 4', 'Point 5'];
    const values = [10, 20, 15, 30, 25];
    return { labels, values };
  }

  renderChart(): void {
    const ctx = document.getElementById('insightsChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartData.labels,
        datasets: [
          {
            label: 'Insights Data',
            data: this.chartData.values,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
