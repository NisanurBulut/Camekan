import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, viewChild } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import { APP_NAME } from '../app.constants';
import { ThemeService } from '../core/services/theme.service';
import { DashboardData } from '../shared/models/dashboard.model';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'cmk-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [DatePipe, DecimalPipe, PercentPipe, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private dashboardService = inject(DashboardService);
  private translate = inject(TranslateService);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private themeService = inject(ThemeService);
  protected readonly appName = APP_NAME;

  dashboard = rxResource({ stream: () => this.dashboardService.getDashboard() });

  private lang = toSignal(this.translate.onLangChange.pipe(map(e => e.lang)), { initialValue: this.translate.currentLang });
  private salesCanvas = viewChild<ElementRef<HTMLCanvasElement>>('salesCanvas');
  private categoryCanvas = viewChild<ElementRef<HTMLCanvasElement>>('categoryCanvas');

  kpis = computed(() => {
    const kpis = this.dashboard.value()?.kpis;
    return kpis ? [
      { label: 'DASHBOARD.TOTAL_BOOKS', value: kpis.totalBooks, icon: 'fa-book', color: 'var(--series-1)' },
      { label: 'DASHBOARD.TOTAL_SALES', value: kpis.totalSales, icon: 'fa-shopping-bag', color: 'var(--series-2)' },
      { label: 'DASHBOARD.PUBLISHERS', value: kpis.authors, icon: 'fa-building-o', color: 'var(--series-3)' },
      { label: 'DASHBOARD.CATEGORIES', value: kpis.categories, icon: 'fa-tags', color: 'var(--series-4)' }
    ] : [];
  });

  salesTrend = computed(() => (this.dashboard.value()?.salesTrend ?? []).map(m => {
    const [year, month] = m.month.split('-').map(Number);
    return { date: new Date(year, month - 1, 1), total: m.total };
  }));

  categories = computed(() => {
    const categories = this.dashboard.value()?.categories ?? [];
    const total = categories.reduce((sum, c) => sum + c.count, 0) || 1;
    return categories.map(c => ({ ...c, share: c.count / total }));
  });

  topBooks = computed(() => {
    const books = this.dashboard.value()?.topBooks ?? [];
    const max = Math.max(...books.map(b => b.sales), 1);
    return books.map(b => ({ ...b, percent: Math.round(b.sales / max * 100) }));
  });

  constructor() {
    // Charts are drawn on canvas, so they are rebuilt whenever data, theme (colors) or language (labels) change.
    effect(onCleanup => {
      const data = this.dashboard.hasValue() ? this.dashboard.value() : undefined;
      const sales = this.salesCanvas();
      const categories = this.categoryCanvas();
      this.themeService.theme();
      const lang = this.lang();
      if (!data || !sales || !categories) {
        return;
      }
      const charts = [this.createSalesChart(sales.nativeElement, lang), this.createCategoryChart(categories.nativeElement, data)];
      onCleanup(() => charts.forEach(chart => chart.destroy()));
    });
  }

  private color(token: string): string {
    return getComputedStyle(this.host.nativeElement).getPropertyValue(token).trim();
  }

  private createSalesChart(canvas: HTMLCanvasElement, lang: string): Chart {
    const monthLabel = new Intl.DateTimeFormat(lang, { month: 'short', year: '2-digit' });
    const series = this.color('--series-1');
    const muted = this.color('--text-muted');
    return new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.salesTrend().map(m => monthLabel.format(m.date)),
        datasets: [{
          label: this.translate.instant('DASHBOARD.SALES'),
          data: this.salesTrend().map(m => m.total),
          borderColor: series,
          backgroundColor: series,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          cubicInterpolationMode: 'monotone'
        }]
      },
      options: {
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: muted } },
          y: { beginAtZero: true, grid: { color: this.color('--border') }, border: { display: false }, ticks: { color: muted } }
        }
      }
    });
  }

  private createCategoryChart(canvas: HTMLCanvasElement, data: DashboardData): Chart {
    return new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: data.categories.map(c => c.name),
        datasets: [{
          data: data.categories.map(c => c.count),
          backgroundColor: data.categories.map((_, i) => this.color(`--series-${i + 1}`)),
          borderColor: this.color('--surface'),
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: { legend: { display: false } }
      }
    });
  }
}
