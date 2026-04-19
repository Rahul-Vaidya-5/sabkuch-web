import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sales-executive-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-executive-dashboard.component.html',
  styleUrl: './sales-executive-dashboard.component.scss'
})
export class SalesExecutiveDashboardComponent {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly activeTab = signal<'overview' | 'billing' | 'customers'>('overview');

  readonly todaySales = computed(() => 12450);
  readonly totalOrders = computed(() => 34);
  readonly avgOrderValue = computed(() => 366);
  readonly returnsCount = computed(() => 2);

  readonly transactions = signal([
    { id: 'BIL-001', customer: 'Rajesh Kumar', amount: 2450, items: 3, time: '10:30 AM', status: 'Completed' },
    { id: 'BIL-002', customer: 'Priya Singh', amount: 1850, items: 5, time: '11:15 AM', status: 'Completed' },
    { id: 'BIL-003', customer: 'Amit Patel', amount: 3200, items: 2, time: '12:45 PM', status: 'Completed' }
  ]);

  logout(): void {
    this.authService.logout();
  }

  setTab(tab: 'overview' | 'billing' | 'customers'): void {
    this.activeTab.set(tab);
  }
}
