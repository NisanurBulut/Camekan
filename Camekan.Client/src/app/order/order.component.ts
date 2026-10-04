import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { IOrder, IOrderItem } from '../shared/models/order.model';
import { OrderService } from './order.service';

// Backend sends the OrderStatus enum name as a string (PaymenyFailed is spelled that way in the enum).
const STATUS: Record<string, { key: string; badge: string }> = {
  Pending: { key: 'ORDER.STATUS_PENDING', badge: 'badge-warning' },
  PaymentReceived: { key: 'ORDER.STATUS_PAID', badge: 'badge-success' },
  PaymenyFailed: { key: 'ORDER.STATUS_FAILED', badge: 'badge-danger' }
};

@Component({
  selector: 'cmk-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: false,
  // All state is in signals, so the view only needs checking when they change.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);

  // null = not loaded yet, [] = the user has no orders
  orders = signal<IOrder[] | null>(null);
  private allOrders = computed(() => this.orders() ?? []);

  // Failed payments are not counted as spending. Pending ones are, because locally
  // the Stripe webhook usually doesn't run and paid orders stay Pending.
  private validOrders = computed(() => this.allOrders().filter(o => o.status !== 'PaymenyFailed'));

  summary = computed(() => {
    const orders = this.validOrders();
    const spent = orders.reduce((sum, o) => sum + o.total, 0);
    const books = orders.reduce((sum, o) => sum + o.orderItems.reduce((s, i) => s + i.quantity, 0), 0);
    return {
      count: this.allOrders().length,
      spent,
      books,
      average: orders.length ? spent / orders.length : 0,
      pending: this.allOrders().filter(o => o.status === 'Pending').length
    };
  });

  monthly = computed(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => ({
      date: new Date(now.getFullYear(), now.getMonth() - 5 + i, 1),
      total: 0
    }));
    for (const order of this.validOrders()) {
      const d = new Date(order.orderDate);
      const month = months.find(m => m.date.getFullYear() === d.getFullYear() && m.date.getMonth() === d.getMonth());
      if (month) {
        month.total += order.total;
      }
    }
    const max = Math.max(...months.map(m => m.total), 1);
    return months.map(m => ({ ...m, percent: Math.round(m.total / max * 100) }));
  });

  topBooks = computed(() => {
    const byProduct = new Map<number, IOrderItem>();
    for (const item of this.validOrders().flatMap(o => o.orderItems)) {
      const book = byProduct.get(item.productId) ?? { ...item, quantity: 0 };
      book.quantity += item.quantity;
      byProduct.set(item.productId, book);
    }
    return [...byProduct.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 3);
  });

  ngOnInit(): void {
    this.orderService.getOrdersForUser()
      .subscribe({
        next: (result: IOrder[]) => this.orders.set(result),
        error: error => console.log(error)
      });
  }

  statusOf(status: string) {
    return STATUS[status] ?? { key: status, badge: 'badge-secondary' };
  }
}
