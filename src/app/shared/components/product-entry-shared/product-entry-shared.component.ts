import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import JsBarcode from 'jsbarcode';

import { ProductBlueprint } from '../../../models/inventory.models';
import { ProductMastersService } from '../../../services/product-masters.service';
import { Product, ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-product-entry-shared',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-entry-shared.component.html',
  styleUrl: './product-entry-shared.component.scss'
})
export class ProductEntrySharedComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly productMasters = inject(ProductMastersService);
  private readonly requiredFields = [
    'productName',
    'category',
    'brand',
    'variantLabel',
    'unit',
    'conversionFactor',
    'sizeLabel',
    'batchCode',
    'openingStock',
    'packageMrp',
    'packageSalePrice',
    'singleUnitMrp',
    'singleUnitSalePrice',
    'wholesellerNew',
    'wholesellerOld',
    'retailerNew',
    'retailerOld',
    'gstType',
    'gstPercent'
  ];

  readonly productForm: FormGroup = this.createForm();
  readonly activeSection = signal<'details' | 'pricing' | 'discount' | 'gst'>('details');
  readonly isSubmitting = signal(false);
  readonly submitted = signal(false);
  readonly successMessage = signal('');
  readonly barcodeGenerated = signal(false);
  readonly generatedBarcodeKey = signal('');

  readonly categoryOptions = this.productMasters.productCategories;
  readonly brandOptions = this.productMasters.brands;
  readonly variantOptions = this.productMasters.productVariants;
  readonly unitOptions = this.productMasters.units;
  readonly packageLabelOptions = this.productMasters.packageLabels;

  readonly gstTypeOptions = [
    { value: 'CGST_SGST', label: 'CGST + SGST' },
    { value: 'IGST', label: 'IGST' }
  ];

  readonly gstSlabOptions = [
    { value: 0, label: 'Exempt Category', description: 'Tax-free essentials and exempt products' },
    { value: 5, label: 'Essential Category', description: 'Daily-use and essential goods' },
    { value: 12, label: 'Standard Category', description: 'Processed and packaged items' },
    { value: 18, label: 'General Category', description: 'Most products fall under this slab' },
    { value: 28, label: 'Luxury Category', description: 'Premium, luxury, and sin goods' }
  ];

  readonly sizeLabels = this.packageLabelOptions;

  readonly completionPercentage = computed(() => {
    let filledFields = 0;
    const totalFields = this.requiredFields.length;

    this.requiredFields.forEach(key => {
      const value = this.productForm.get(key)?.value;
      const hasValue = value !== null && value !== undefined && value !== '';
      if (hasValue) {
        filledFields++;
      }
    });

    return Math.round((filledFields / totalFields) * 100);
  });

  readonly isDetailsValid = computed(() => {
    const form = this.productForm;
    return !!(
      form.get('productName')?.valid &&
      form.get('category')?.valid &&
      form.get('brand')?.valid &&
      form.get('variantLabel')?.valid &&
      form.get('unit')?.valid &&
      form.get('sizeLabel')?.valid &&
      form.get('batchCode')?.valid
    );
  });

  readonly calculatedPackageDiscount = computed(() => {
    const mrp = this.productForm.get('packageMrp')?.value;
    const salePrice = this.productForm.get('packageSalePrice')?.value;
    if (!mrp || !salePrice) return 0;
    return Math.round(((mrp - salePrice) / mrp) * 100);
  });

  readonly calculatedUnitDiscount = computed(() => {
    const mrp = this.productForm.get('singleUnitMrp')?.value;
    const salePrice = this.productForm.get('singleUnitSalePrice')?.value;
    if (!mrp || !salePrice) return 0;
    return Math.round(((mrp - salePrice) / mrp) * 100);
  });

  setActiveSection(section: 'details' | 'pricing' | 'discount' | 'gst'): void {
    this.activeSection.set(section);
  }

  canUseBarcodeActions(): boolean {
    const value = String(this.productForm.get('barcode')?.value || '').trim();
    return /^\d{12}$/.test(value);
  }

  canSubmitProduct(): boolean {
    const stockControl = this.productForm.get('openingStock');
    const stockValue = stockControl?.value;
    const quantityFilled = stockValue !== null && stockValue !== undefined && stockValue !== '';
    const barcodeValue = String(this.productForm.get('barcode')?.value || '').trim();
    const barcodeFormatValid = /^\d{12}$/.test(barcodeValue);

    const currentKey = this.buildCompositeKey(
      this.productForm.get('productName')?.value,
      this.productForm.get('category')?.value,
      this.productForm.get('brand')?.value,
      this.productForm.get('variantLabel')?.value,
      this.productForm.get('unit')?.value,
      this.productForm.get('sizeLabel')?.value
    );

    const existingProductBarcode = this.productsService.getProductByCompositeKey(currentKey)?.barcode;
    const expectedBarcode = existingProductBarcode || this.createUniqueBarcodeForKey(currentKey);
    const barcodeMatchesIdentity = barcodeValue === expectedBarcode;

    return barcodeFormatValid && barcodeMatchesIdentity && !!stockControl?.valid && quantityFilled;
  }

  submitForm(): void {
    this.submitted.set(true);
    this.successMessage.set('');

    this.productForm.markAllAsTouched();

    if (!this.productForm.valid) {
      return;
    }

    if (!this.validatePricePairs()) {
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.productForm.value;
    const compositeKey = this.buildCompositeKey(
      formValue.productName,
      formValue.category,
      formValue.brand,
      formValue.variantLabel,
      formValue.unit,
      formValue.sizeLabel
    );
    const existingProduct = this.productsService.getProductByCompositeKey(compositeKey);

    const productData: ProductBlueprint = {
      productName: formValue.productName,
      category: formValue.category,
      brand: formValue.brand,
      variant: {
        label: formValue.variantLabel,
        unit: formValue.unit,
        conversionFactor: formValue.conversionFactor,
        sizeLabel: formValue.sizeLabel
      },
      batchCode: formValue.batchCode,
      barcode: formValue.barcode || undefined,
      pricing: {
        packageMrp: formValue.packageMrp,
        packageSalePrice: formValue.packageSalePrice,
        singleUnitMrp: formValue.singleUnitMrp,
        singleUnitSalePrice: formValue.singleUnitSalePrice
      },
      discount: {
        wholesellerNew: formValue.wholesellerNew,
        wholesellerOld: formValue.wholesellerOld,
        retailerNew: formValue.retailerNew,
        retailerOld: formValue.retailerOld
      },
      gst: {
        gstType: formValue.gstType,
        gstPercent: formValue.gstPercent
      }
    };

    const incomingStock = Number(formValue.openingStock);

    if (existingProduct) {
      const updatedStock = existingProduct.stock + incomingStock;
      this.productsService.updateProduct(existingProduct.id, {
        stock: updatedStock,
        status: updatedStock <= 10 ? 'Low' : 'Active'
      });

      setTimeout(() => {
        this.isSubmitting.set(false);
        this.successMessage.set(`Stock updated: ${existingProduct.name} (${existingProduct.id}) +${incomingStock}`);
        this.resetForm();
      }, 300);

      return;
    }

    const newProduct: Product = {
      id: this.createProductId(),
      name: productData.productName,
      category: productData.category,
      brand: productData.brand,
      variantLabel: formValue.variantLabel,
      unit: formValue.unit,
      packageLabel: formValue.sizeLabel,
      barcode: formValue.barcode,
      compositeKey,
      price: Number(productData.pricing.packageSalePrice),
      stock: incomingStock,
      status: incomingStock <= 10 ? 'Low' : 'Active'
    };

    this.productsService.addProduct(newProduct);

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.successMessage.set(`Saved: ${newProduct.name} (${newProduct.id})`);
      this.resetForm();
    }, 300);
  }

  addCurrentCategory(): void {
    this.productMasters.addCategory(String(this.productForm.get('category')?.value || ''));
  }

  addCurrentBrand(): void {
    this.productMasters.addBrand(String(this.productForm.get('brand')?.value || ''));
  }

  addCurrentVariant(): void {
    this.productMasters.addVariant(String(this.productForm.get('variantLabel')?.value || ''));
  }

  addCurrentUnit(): void {
    this.productMasters.addUnit(String(this.productForm.get('unit')?.value || ''));
  }

  addCurrentPackageLabel(): void {
    this.productMasters.addPackageLabel(String(this.productForm.get('sizeLabel')?.value || ''));
  }

  generateBarcode(): void {
    const productName = this.productForm.get('productName')?.value;
    const category = this.productForm.get('category')?.value;
    const brand = this.productForm.get('brand')?.value;
    const variantLabel = this.productForm.get('variantLabel')?.value;
    const unit = this.productForm.get('unit')?.value;
    const packageLabel = this.productForm.get('sizeLabel')?.value;
    const compositeKey = this.buildCompositeKey(productName, category, brand, variantLabel, unit, packageLabel);
    const existingProduct = this.productsService.getProductByCompositeKey(compositeKey);

    const barcode = existingProduct?.barcode || this.createUniqueBarcodeForKey(compositeKey);
    this.productForm.get('barcode')?.setValue(barcode);
    this.barcodeGenerated.set(true);
    this.generatedBarcodeKey.set(compositeKey);
    this.renderBarcodeSvg(barcode);
  }

  downloadBarcode(): void {
    const barcode = String(this.productForm.get('barcode')?.value || '').trim();
    if (!/^\d{12}$/.test(barcode)) {
      return;
    }

    this.renderBarcodeSvg(barcode);
    const svgElement = this.getBarcodeSvgElement();
    if (!svgElement) {
      return;
    }

    const serialized = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${barcode}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }

  printBarcode(): void {
    const barcode = String(this.productForm.get('barcode')?.value || '').trim();
    if (!/^\d{12}$/.test(barcode)) {
      return;
    }

    this.renderBarcodeSvg(barcode);
    const svgElement = this.getBarcodeSvgElement();
    if (!svgElement) {
      return;
    }

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
            .wrap { display: flex; min-height: 100vh; align-items: center; justify-content: center; flex-direction: column; gap: 12px; }
            svg { max-width: 320px; height: auto; }
            .code { letter-spacing: 0.12em; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="wrap">
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

  selectGstSlab(value: number): void {
    this.productForm.get('gstPercent')?.setValue(value);
    this.productForm.get('gstPercent')?.markAsTouched();
  }

  resetForm(): void {
    this.productForm.reset({
      unit: this.getDefaultUnit(),
      gstType: 'CGST_SGST',
      gstPercent: 18,
      conversionFactor: 1,
      openingStock: null,
      wholesellerNew: 0,
      wholesellerOld: 0,
      retailerNew: 0,
      retailerOld: 0
    });
    this.submitted.set(false);
    this.barcodeGenerated.set(false);
    this.generatedBarcodeKey.set('');
    this.activeSection.set('details');

    const svgElement = this.getBarcodeSvgElement();
    if (svgElement) {
      while (svgElement.firstChild) {
        svgElement.removeChild(svgElement.firstChild);
      }
    }
  }

  getFieldError(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (control?.hasError('required')) return 'This field is required';
    if (control?.hasError('minlength')) return `Minimum ${control.errors?.['minlength'].requiredLength} characters`;
    if (control?.hasError('min')) return `Minimum value is ${control.errors?.['min'].min}`;
    if (control?.hasError('max')) return `Maximum value is ${control.errors?.['max'].max}`;
    if (control?.hasError('pattern') && fieldName === 'openingStock') return 'Enter quantity using digits only';
    if (control?.hasError('pattern') && fieldName === 'barcode') return 'Barcode should contain numeric digits only';
    if ((control?.hasError('minlength') || control?.hasError('maxlength')) && fieldName === 'barcode') return 'Barcode must be exactly 12 digits';
    if (control?.hasError('pattern')) return 'Invalid format';
    if (control?.hasError('saleHigherThanMrp')) return 'Sale price cannot exceed MRP';
    return '';
  }

  private createForm(): FormGroup {
    return this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      brand: ['', [Validators.required, Validators.minLength(2)]],
      variantLabel: ['', Validators.required],
      unit: [this.getDefaultUnit(), Validators.required],
      conversionFactor: [1, [Validators.required, Validators.min(0.1)]],
      sizeLabel: ['', Validators.required],
      batchCode: ['', [Validators.required, Validators.minLength(3)]],
      openingStock: [null, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]],
      barcode: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern(/^\d+$/)]],
      packageMrp: ['', [Validators.required, Validators.min(0)]],
      packageSalePrice: ['', [Validators.required, Validators.min(0)]],
      singleUnitMrp: ['', [Validators.required, Validators.min(0)]],
      singleUnitSalePrice: ['', [Validators.required, Validators.min(0)]],
      wholesellerNew: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      wholesellerOld: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      retailerNew: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      retailerOld: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      gstType: ['CGST_SGST', Validators.required],
      gstPercent: [18, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  private createProductId(): string {
    const sequence = this.productsService.products().length + 1;
    return `PRD-${sequence.toString().padStart(3, '0')}`;
  }

  private buildCompositeKey(
    productName: string,
    category: string,
    brand: string,
    variantLabel: string,
    unit: string,
    packageLabel: string
  ): string {
    return [productName, category, brand, variantLabel, unit, packageLabel]
      .map(value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' '))
      .join('|');
  }

  private createUniqueBarcodeForKey(compositeKey: string): string {
    const currentProducts = this.productsService.products();
    let attempt = 0;
    let seed = compositeKey;
    let barcode = this.createBarcodeFromSeed(seed);

    while (currentProducts.some(product => product.barcode === barcode && product.compositeKey !== compositeKey)) {
      attempt += 1;
      seed = `${compositeKey}#${attempt}`;
      barcode = this.createBarcodeFromSeed(seed);
    }

    return barcode;
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

  private renderBarcodeSvg(barcode: string): void {
    const svgElement = this.getBarcodeSvgElement();
    if (!svgElement) {
      return;
    }

    JsBarcode(svgElement, barcode, {
      format: 'CODE128',
      displayValue: false,
      height: 52,
      margin: 0,
      width: 1.6,
      lineColor: '#0f172a'
    });
  }

  private getBarcodeSvgElement(): SVGSVGElement | null {
    return document.getElementById('product-barcode-svg') as SVGSVGElement | null;
  }

  private getDefaultUnit(): string {
    return this.productMasters.units()[0] || 'piece';
  }

  private validatePricePairs(): boolean {
    const packageMrp = Number(this.productForm.get('packageMrp')?.value);
    const packageSalePrice = Number(this.productForm.get('packageSalePrice')?.value);
    const singleUnitMrp = Number(this.productForm.get('singleUnitMrp')?.value);
    const singleUnitSalePrice = Number(this.productForm.get('singleUnitSalePrice')?.value);

    let valid = true;

    if (packageSalePrice > packageMrp) {
      this.productForm.get('packageSalePrice')?.setErrors({ saleHigherThanMrp: true });
      valid = false;
    }

    if (singleUnitSalePrice > singleUnitMrp) {
      this.productForm.get('singleUnitSalePrice')?.setErrors({ saleHigherThanMrp: true });
      valid = false;
    }

    return valid;
  }
}
