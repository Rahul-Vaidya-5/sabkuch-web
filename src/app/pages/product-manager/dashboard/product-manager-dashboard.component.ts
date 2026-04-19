import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ProductsService } from '../../../services/products.service';
import { ProductEntrySharedComponent } from '../../../shared/components/product-entry-shared/product-entry-shared.component';
import { ProductListSharedComponent } from '../../../shared/components/product-list-shared/product-list-shared.component';
import { ProductMastersSharedComponent } from '../../../shared/components/product-masters-shared/product-masters-shared.component';

@Component({
  selector: 'app-product-manager-dashboard',
  standalone: true,
  imports: [CommonModule, ProductEntrySharedComponent, ProductListSharedComponent, ProductMastersSharedComponent],
  templateUrl: './product-manager-dashboard.component.html',
  styleUrl: './product-manager-dashboard.component.scss'
})
export class ProductManagerDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly productsService = inject(ProductsService);

  readonly currentUser = this.authService.currentUser;
  readonly activeTab = signal<'overview' | 'product' | 'entry' | 'pricing' | 'masters'>('entry');
  readonly isSidebarOpen = signal(false);
  readonly totalProducts = this.productsService.totalProducts;
  readonly activeProducts = this.productsService.activeProducts;
  readonly newArrivals = this.productsService.lowStockItems;
  readonly categories = this.productsService.categories;
  readonly navItems = [
    { key: 'overview', label: 'Overview', icon: '◫' },
    { key: 'entry', label: 'Add Product', icon: '+' },
    { key: 'product', label: 'Products', icon: '□' },
    { key: 'pricing', label: 'Pricing', icon: '₹' },
    { key: 'masters', label: 'Masters', icon: '≡' }
  ] as const;

  logout(): void {
    this.authService.logout();
  }

  setTab(tab: 'overview' | 'entry' | 'product' | 'pricing' | 'masters'): void {
    this.activeTab.set(tab);
    this.isSidebarOpen.set(false);
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(value => !value);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
