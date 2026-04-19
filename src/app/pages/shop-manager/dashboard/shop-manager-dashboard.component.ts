import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ProductsService } from '../../../services/products.service';
import { ProductEntrySharedComponent } from '../../../shared/components/product-entry-shared/product-entry-shared.component';
import { ProductListSharedComponent } from '../../../shared/components/product-list-shared/product-list-shared.component';

@Component({
  selector: 'app-shop-manager-dashboard',
  standalone: true,
  imports: [CommonModule, ProductEntrySharedComponent, ProductListSharedComponent],
  templateUrl: './shop-manager-dashboard.component.html',
  styleUrl: './shop-manager-dashboard.component.scss'
})
export class ShopManagerDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly productsService = inject(ProductsService);

  readonly currentUser = this.authService.currentUser;
  readonly activeTab = signal<'overview' | 'entry' | 'products' | 'pricing'>('entry');

  readonly totalProducts = this.productsService.totalProducts;
  readonly lowStockItems = this.productsService.lowStockItems;
  readonly activeProducts = this.productsService.activeProducts;
  readonly totalInventory = computed(() => 15420);
  readonly avgPrice = computed(() => 450);

  logout(): void {
    this.authService.logout();
  }

  setTab(tab: 'overview' | 'entry' | 'products' | 'pricing'): void {
    this.activeTab.set(tab);
  }
}
