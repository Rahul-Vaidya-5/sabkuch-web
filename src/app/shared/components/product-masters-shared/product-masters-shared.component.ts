import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProductMastersService } from '../../../services/product-masters.service';

type MasterGroup = 'category' | 'brand' | 'variant' | 'unit' | 'packageLabel';

@Component({
  selector: 'app-product-masters-shared',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-masters-shared.component.html',
  styleUrl: './product-masters-shared.component.scss'
})
export class ProductMastersSharedComponent {
  private readonly productMasters = inject(ProductMastersService);

  readonly newCategory = signal('');
  readonly newBrand = signal('');
  readonly newVariant = signal('');
  readonly newUnit = signal('');
  readonly newPackageLabel = signal('');

  readonly editingGroup = signal<MasterGroup | null>(null);
  readonly editingIndex = signal<number>(-1);
  readonly editingValue = signal('');

  readonly productCategories = this.productMasters.productCategories;
  readonly brands = this.productMasters.brands;
  readonly productVariants = this.productMasters.productVariants;
  readonly units = this.productMasters.units;
  readonly packageLabels = this.productMasters.packageLabels;

  readonly summary = computed(() => ({
    categories: this.productCategories().length,
    brands: this.brands().length,
    variants: this.productVariants().length,
    units: this.units().length,
    packageLabels: this.packageLabels().length
  }));

  addCategory(): void {
    this.productMasters.addCategory(this.newCategory());
    this.newCategory.set('');
  }

  addBrand(): void {
    this.productMasters.addBrand(this.newBrand());
    this.newBrand.set('');
  }

  addVariant(): void {
    this.productMasters.addVariant(this.newVariant());
    this.newVariant.set('');
  }

  addUnit(): void {
    this.productMasters.addUnit(this.newUnit());
    this.newUnit.set('');
  }

  addPackageLabel(): void {
    this.productMasters.addPackageLabel(this.newPackageLabel());
    this.newPackageLabel.set('');
  }

  startEdit(group: MasterGroup, index: number, value: string): void {
    this.editingGroup.set(group);
    this.editingIndex.set(index);
    this.editingValue.set(value);
  }

  cancelEdit(): void {
    this.editingGroup.set(null);
    this.editingIndex.set(-1);
    this.editingValue.set('');
  }

  saveEdit(): void {
    const group = this.editingGroup();
    const index = this.editingIndex();
    const value = this.editingValue();

    if (group === null || index < 0) {
      return;
    }

    switch (group) {
      case 'category':
        this.productMasters.renameCategory(index, value);
        break;
      case 'brand':
        this.productMasters.renameBrand(index, value);
        break;
      case 'variant':
        this.productMasters.renameVariant(index, value);
        break;
      case 'unit':
        this.productMasters.renameUnit(index, value);
        break;
      case 'packageLabel':
        this.productMasters.renamePackageLabel(index, value);
        break;
    }

    this.cancelEdit();
  }

  deleteItem(group: MasterGroup, index: number): void {
    switch (group) {
      case 'category':
        this.productMasters.removeCategory(index);
        break;
      case 'brand':
        this.productMasters.removeBrand(index);
        break;
      case 'variant':
        this.productMasters.removeVariant(index);
        break;
      case 'unit':
        this.productMasters.removeUnit(index);
        break;
      case 'packageLabel':
        this.productMasters.removePackageLabel(index);
        break;
    }

    if (this.editingGroup() === group && this.editingIndex() === index) {
      this.cancelEdit();
    }
  }

  isEditing(group: MasterGroup, index: number): boolean {
    return this.editingGroup() === group && this.editingIndex() === index;
  }
}
