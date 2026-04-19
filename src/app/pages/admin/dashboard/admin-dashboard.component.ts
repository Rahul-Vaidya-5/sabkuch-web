import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ProductsService } from '../../../services/products.service';
import { ProductEntrySharedComponent } from '../../../shared/components/product-entry-shared/product-entry-shared.component';
import { ProductListSharedComponent } from '../../../shared/components/product-list-shared/product-list-shared.component';
import { ProductMastersSharedComponent } from '../../../shared/components/product-masters-shared/product-masters-shared.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ProductEntrySharedComponent, ProductListSharedComponent, ProductMastersSharedComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly productsService = inject(ProductsService);

  readonly currentUser = this.authService.currentUser;
  readonly activeTab = signal<'overview' | 'users' | 'operations' | 'products' | 'entry' | 'masters'>('overview');

  // Mock stats
  readonly totalUsers = computed(() => 15);
  readonly activeUsers = computed(() => 12);
  readonly inactiveUsers = computed(() => 3);
  readonly totalSales = computed(() => 450000);
  readonly totalOrders = computed(() => 234);
  readonly avgOrderValue = computed(() => 1923);

  readonly totalProducts = this.productsService.totalProducts;
  readonly activeProducts = this.productsService.activeProducts;
  readonly lowStockItems = this.productsService.lowStockItems;

  // Mock users data
  readonly users = signal([
    { id: 'USR-001', name: 'Rajesh Kumar', role: 'Manager', status: 'Active', lastLogin: '2 hours ago' },
    { id: 'USR-002', name: 'Priya Singh', role: 'Sales', status: 'Active', lastLogin: '5 hours ago' },
    { id: 'USR-003', name: 'Amit Patel', role: 'Stock Keeper', status: 'Active', lastLogin: 'Today' },
    { id: 'USR-004', name: 'Zara Khan', role: 'Product Manager', status: 'Inactive', lastLogin: '3 days ago' },
    { id: 'USR-005', name: 'Dev Mehta', role: 'Sales', status: 'Active', lastLogin: '1 hour ago' }
  ]);

  logout(): void {
    this.authService.logout();
  }

  setTab(tab: 'overview' | 'users' | 'operations' | 'products' | 'entry' | 'masters'): void {
    this.activeTab.set(tab);
  }
}
