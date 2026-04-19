import { Injectable, computed, signal } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  variantLabel?: string;
  unit?: string;
  packageLabel?: string;
  barcode?: string;
  compositeKey?: string;
  disableReason?: string;
  lastBatchId?: string;
  lastPurchaseDate?: string;
  lastPurchaseOrderId?: string;
  lastStockUpdateReason?: string;
  lastPriceUpdatedOn?: string;
  lastPriceUpdateReason?: string;
  price: number;
  stock: number;
  status: 'Active' | 'Inactive' | 'Low' | 'Normal';
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  readonly products = signal<Product[]>([
    { id: 'PRD-001', name: 'Hammer', category: 'Tools', brand: 'Stanley', price: 250, stock: 45, status: 'Active' },
    { id: 'PRD-002', name: 'Nails Pack', category: 'Hardware', brand: 'Saali', price: 50, stock: 5, status: 'Active' },
    { id: 'PRD-003', name: 'Screwdriver Set', category: 'Tools', brand: 'Bosch', price: 320, stock: 28, status: 'Active' },
    { id: 'PRD-004', name: 'Cement Bag', category: 'Materials', brand: 'Ambuja', price: 350, stock: 2, status: 'Inactive' },
    { id: 'PRD-005', name: 'Paint Brush', category: 'Paint', brand: 'Asian', price: 120, stock: 15, status: 'Active' },
    { id: 'PRD-006', name: 'PVC Pipe', category: 'Plumbing', brand: 'Supreme', price: 180, stock: 8, status: 'Active' }
  ]);

  readonly totalProducts = computed(() => this.products().length);
  readonly lowStockItems = computed(() => this.products().filter(p => p.stock <= 10).length);
  readonly activeProducts = computed(() => this.products().filter(p => p.status === 'Active').length);
  readonly categories = computed(() => new Set(this.products().map(p => p.category)).size);

  addProduct(product: Product): void {
    const currentProducts = this.products();
    this.products.set([...currentProducts, product]);
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    const currentProducts = this.products();
    const index = currentProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      currentProducts[index] = { ...currentProducts[index], ...updates };
      this.products.set([...currentProducts]);
    }
  }

  deleteProduct(id: string): void {
    const currentProducts = this.products();
    this.products.set(currentProducts.filter(p => p.id !== id));
  }

  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  getProductByCompositeKey(compositeKey: string): Product | undefined {
    return this.products().find(p => p.compositeKey === compositeKey);
  }
}
