import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ListRange } from '@angular/cdk/collections';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { IOrderListItem, OrderStatus } from '../shared/models/order.model';
import { OrderService } from './order.service';


const PAGE_SIZE = 50;
const ROW_HEIGHT = 48;

const STATUS: Record<OrderStatus, { key: string; badge: string; icon: string }> = {
  Pending: { key: 'ORDER.STATUS_PENDING', badge: 'badge-warning', icon: 'fa-clock-o' },
  PaymentReceived: { key: 'ORDER.STATUS_PAID', badge: 'badge-success', icon: 'fa-check' },
  PaymentFailed: { key: 'ORDER.STATUS_FAILED', badge: 'badge-danger', icon: 'fa-times' }
};

@Component({
  selector: 'cmk-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, RouterLink, CurrencyPipe, DatePipe, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent {
  private orderService = inject(OrderService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  readonly rowHeight = ROW_HEIGHT;

  // ---------- Dashboard ----------
  summary = rxResource({ stream: () => this.orderService.getOrderSummary() });

  kpis = computed(() => {
    const s = this.summary.value();
    return s ? [
      { label: 'ORDER.DASH_ORDERS', value: s.count, currency: false, icon: 'fa-shopping-bag', tone: 'blue' },
      { label: 'ORDER.DASH_SPENT', value: s.spent, currency: true, icon: 'fa-money', tone: 'teal' },
      { label: 'ORDER.DASH_BOOKS', value: s.books, currency: false, icon: 'fa-book', tone: 'purple' },
      { label: 'ORDER.DASH_AVG', value: s.average, currency: true, icon: 'fa-line-chart', tone: 'orange' }
    ] : [];
  });

  monthly = computed(() => {
    const months = this.summary.value()?.monthly ?? [];
    const max = Math.max(...months.map(m => m.total), 1);
    return months.map(m => ({
      key: `${m.year}-${m.month}`,
      date: new Date(m.year, m.month - 1, 1),
      total: m.total,
      percent: Math.round(m.total / max * 100)
    }));
  });

  // ---------- Order list (server-side paging + virtual scroll) ----------

  totalCount = signal<number | null>(null);
  listError = signal(false);
  private pages = signal<ReadonlyMap<number, IOrderListItem[]>>(new Map());
  private requested = new Set<number>();

  rows = computed(() => {
    const rows: (IOrderListItem | undefined)[] = new Array(this.totalCount() ?? 0).fill(undefined);
    for (const [page, items] of this.pages()) {
      items.forEach((item, i) => rows[(page - 1) * PAGE_SIZE + i] = item);
    }
    return rows;
  });

  private lang = toSignal(this.translate.onLangChange.pipe(map(e => e.lang)), { initialValue: this.translate.currentLang });
  statusLabels = computed(() => {
    this.lang();
    const labels : Partial<Record<string, string>> = {};
    for (const [status, { key }] of Object.entries(STATUS)) {
      labels[status] = this.translate.instant(key);
    }
    return labels;
  });

  private visibleRange$ = new Subject<ListRange>();

  constructor() {
    this.loadPage(1);
    this.visibleRange$
      .pipe(debounceTime(100), takeUntilDestroyed())
      .subscribe(range => this.loadRange(range));
  }

  badgeOf(status: OrderStatus) {
    return STATUS[status]?.badge ?? 'badge-secondary';
  }

  iconOf(status: OrderStatus) {
    return STATUS[status]?.icon ?? 'fa-question';
  }

  trackByIndex = (index: number) => index;

  onRangeChange(range: ListRange) {
    this.visibleRange$.next(range);
  }

  retryList() {
    this.listError.set(false);
    this.requested.clear();
    this.loadPage(1);
  }

  private loadRange({ start, end }: ListRange) {
    const firstPage = Math.floor(start / PAGE_SIZE) + 1;
    const lastPage = Math.floor(Math.max(start, end - 1) / PAGE_SIZE) + 1;
    for (let page = firstPage; page <= lastPage; page++) {
      this.loadPage(page);
    }
  }

  private loadPage(page: number) {
    if (this.requested.has(page)) {
      return;
    }
    this.requested.add(page);
    this.orderService.getOrdersPage(page, PAGE_SIZE)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: result => {
          this.totalCount.set(result.count);
          this.pages.update(pages => new Map(pages).set(page, result.data));
        },
        error: () => {
          this.requested.delete(page);
          if (page === 1) {
            this.listError.set(true);
          }
        }
      });
  }
}
