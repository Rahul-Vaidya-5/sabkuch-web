import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import JsBarcode from 'jsbarcode';

import { Product, ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-product-list-shared',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list-shared.component.html',
  styleUrl: './product-list-shared.component.scss'
})
export class ProductListSharedComponent {
  private readonly productsService = inject(ProductsService);

  readonly title = input('📦 Product Catalog');
  readonly addButtonLabel = input('+ Add Product');
  readonly showAddButton = input(true);
  readonly allowDelete = input(false);
  readonly emptyMessage = input('No products found matching your search.');

  readonly addProduct = output<void>();

  readonly searchQuery = signal('');
  readonly activeModal = signal<'none' | 'stock' | 'price' | 'disable' | 'history' | 'delete'>('none');
  readonly activeProductId = signal<string | null>(null);
  readonly modalError = signal('');

  readonly stockQtyDraft = signal('');
  readonly batchIdDraft = signal('');
  readonly purchaseDateDraft = signal('');
  readonly purchaseOrderIdDraft = signal('');
  readonly stockPriceDraft = signal('');

  readonly priceValueDraft = signal('');
  readonly priceDateDraft = signal('');
  readonly priceReasonDraft = signal('');

  readonly disableReasonDraft = signal('');

  readonly products = this.productsService.products;
  readonly selectedProduct = computed(() => {
    const productId = this.activeProductId();
    if (!productId) {
      return null;
    }

    return this.products().find(product => product.id === productId) || null;
  });

  readonly filteredProducts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.products();
    }

    return this.products().filter(product =>
      product.id.toLowerCase().includes(query) ||
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      String(product.barcode || '').toLowerCase().includes(query)
    );
  });

  readonly filteredCount = computed(() => this.filteredProducts().length);
  readonly activeCount = computed(() =>
    this.filteredProducts().filter(product => product.status === 'Active').length
  );
  readonly lowStockCount = computed(() =>
    this.filteredProducts().filter(product => product.stock > 0 && product.stock <= 10).length
  );
  readonly outOfStockCount = computed(() =>
    this.filteredProducts().filter(product => product.stock <= 0).length
  );

  onAddProduct(): void {
    this.addProduct.emit();
  }

  openStockModal(product: Product): void {
    this.activeProductId.set(product.id);
    this.activeModal.set('stock');
    this.modalError.set('');
    this.stockQtyDraft.set('');
    this.batchIdDraft.set('');
    this.purchaseDateDraft.set(new Date().toISOString().slice(0, 10));
    this.purchaseOrderIdDraft.set('');
    this.stockPriceDraft.set(String(product.price));
  }

  openPriceModal(product: Product): void {
    this.activeProductId.set(product.id);
    this.activeModal.set('price');
    this.modalError.set('');
    this.priceValueDraft.set(String(product.price));
    this.priceDateDraft.set(new Date().toISOString().slice(0, 10));
    this.priceReasonDraft.set('');
  }

  openDisableModal(product: Product): void {
    this.activeProductId.set(product.id);
    this.activeModal.set('disable');
    this.modalError.set('');
    this.disableReasonDraft.set(product.disableReason || '');
  }

  openHistoryModal(product: Product): void {
    this.activeProductId.set(product.id);
    this.activeModal.set('history');
    this.modalError.set('');
  }

  openDeleteModal(product: Product): void {
    this.activeProductId.set(product.id);
    this.activeModal.set('delete');
    this.modalError.set('');
    this.disableReasonDraft.set('');
  }

  hasAuditHistory(product: Product): boolean {
    return !!(
      product.lastBatchId ||
      product.lastPurchaseDate ||
      product.lastPurchaseOrderId ||
      product.lastStockUpdateReason ||
      product.lastPriceUpdatedOn ||
      product.lastPriceUpdateReason ||
      product.disableReason
    );
  }

  closeModal(): void {
    this.activeModal.set('none');
    this.activeProductId.set(null);
    this.modalError.set('');
  }

  submitStockModal(): void {
    const product = this.selectedProduct();
    if (!product) {
      return;
    }

    const receivedQty = Number(this.stockQtyDraft());
    const batchId = this.batchIdDraft().trim();
    const purchaseDate = this.purchaseDateDraft().trim();
    const purchaseOrderId = this.purchaseOrderIdDraft().trim();
    const nextPrice = Number(this.stockPriceDraft());

    if (!Number.isFinite(receivedQty) || receivedQty <= 0) {
      this.modalError.set('Enter a valid received quantity greater than 0.');
      return;
    }

    if (!batchId || !purchaseDate || !purchaseOrderId) {
      this.modalError.set('Batch ID, purchase date, and purchase order ID are required.');
      return;
    }

    const updatedStock = product.stock + Math.floor(receivedQty);
    const updates: Partial<Product> = {
      stock: updatedStock,
      status: product.status === 'Inactive' ? 'Inactive' : this.resolveActiveStatus(updatedStock),
      lastBatchId: batchId,
      lastPurchaseDate: purchaseDate,
      lastPurchaseOrderId: purchaseOrderId,
      lastStockUpdateReason: `Stock added via PO ${purchaseOrderId}`
    };

    if (Number.isFinite(nextPrice) && nextPrice > 0) {
      updates.price = Number(nextPrice.toFixed(2));
    }

    this.productsService.updateProduct(product.id, updates);
    this.closeModal();
  }

  submitPriceModal(): void {
    const product = this.selectedProduct();
    if (!product) {
      return;
    }

    const nextPrice = Number(this.priceValueDraft());
    const effectiveDate = this.priceDateDraft().trim();
    const reason = this.priceReasonDraft().trim();

    if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
      this.modalError.set('Enter a valid price greater than 0.');
      return;
    }

    if (!effectiveDate) {
      this.modalError.set('Select an effective date.');
      return;
    }

    this.productsService.updateProduct(product.id, {
      price: Number(nextPrice.toFixed(2)),
      lastPriceUpdatedOn: effectiveDate,
      lastPriceUpdateReason: reason || 'Price revised'
    });

    this.closeModal();
  }

  submitDisableModal(): void {
    const product = this.selectedProduct();
    if (!product) {
      return;
    }

    const reason = this.disableReasonDraft().trim();
    if (!reason) {
      this.modalError.set('Please provide a reason to disable this product.');
      return;
    }

    this.productsService.updateProduct(product.id, {
      status: 'Inactive',
      disableReason: reason
    });

    this.closeModal();
  }

  submitDeleteModal(): void {
    const product = this.selectedProduct();
    if (!product) {
      return;
    }

    const reason = this.disableReasonDraft().trim();
    if (!reason) {
      this.modalError.set('Please provide a reason before deleting this product.');
      return;
    }

    this.productsService.deleteProduct(product.id);
    this.closeModal();
  }

  regenerateBarcode(product: Product): void {
    const compositeKey = product.compositeKey || this.deriveCompositeKey(product);
    const barcode = this.createBarcodeFromSeed(compositeKey);
    this.productsService.updateProduct(product.id, { compositeKey, barcode });
  }

  printBarcode(product: Product): void {
    const compositeKey = product.compositeKey || this.deriveCompositeKey(product);
    const barcode = product.barcode || this.createBarcodeFromSeed(compositeKey);

    if (!product.barcode) {
      this.productsService.updateProduct(product.id, { compositeKey, barcode });
    }

    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    JsBarcode(svgElement, barcode, {
      format: 'CODE128',
      displayValue: false,
      height: 58,
      margin: 0,
      width: 1.75,
      lineColor: '#0f172a'
    });

    const serialized = new XMLSerializer().serializeToString(svgElement);
    const printWindow = window.open('', '_blank', 'width=480,height=360');
    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; }
            .wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 10px; }
            .name { font-weight: 700; color: #0f172a; }
            .code { letter-spacing: 0.1em; color: #334155; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="name">${product.name}</div>
            ${serialized}
            <div class="code">${barcode}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  enableProduct(product: Product): void {
    this.productsService.updateProduct(product.id, {
      status: this.resolveActiveStatus(product.stock),
      disableReason: undefined
    });
  }

  stockLabel(stock: number): string {
    if (stock <= 0) {
      return 'Out of stock';
    }

    if (stock <= 10) {
      return 'Low stock';
    }

    return 'In stock';
  }

  statusText(status: Product['status'], stock: number): string {
    if (stock <= 0) {
      return 'Out of stock';
    }

    if (stock <= 10 || status === 'Low') {
      return 'Low stock';
    }

    if (status === 'Inactive') {
      return 'Inactive';
    }

    return 'Active';
  }

  statusClass(status: Product['status'], stock: number): string {
    if (stock <= 0) {
      return 'out';
    }

    if (stock <= 10 || status === 'Low') {
      return 'low';
    }

    return status.toLowerCase();
  }

  private resolveActiveStatus(stock: number): Product['status'] {
    if (stock <= 10) {
      return 'Low';
    }

    return 'Active';
  }

  private deriveCompositeKey(product: Product): string {
    return [
      product.name,
      product.category,
      product.brand,
      product.variantLabel || '',
      product.unit || '',
      product.packageLabel || ''
    ]
      .map(value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' '))
      .join('|');
  }

  private createBarcodeFromSeed(seed: string): string {
    let hashA = 0;
    let hashB = 7;

    for (let index = 0; index < seed.length; index += 1) {
      const code = seed.charCodeAt(index);
      hashA = (hashA * 31 + code) % 1000000;
      hashB = (hashB * 37 + code) % 1000000;
    }

    return `${hashA.toString().padStart(6, '0')}${hashB.toString().padStart(6, '0')}`;
  }
}
