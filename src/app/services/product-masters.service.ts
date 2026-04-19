import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductMastersService {
  readonly productCategories = signal<string[]>([
    'Paint',
    'Tools',
    'Hardware',
    'Plumbing',
    'Electrical',
    'Construction Materials'
  ]);

  readonly brands = signal<string[]>([
    'Asian Paints',
    'Berger',
    'Stanley',
    'Bosch',
    'Supreme',
    'Ambuja'
  ]);

  readonly productVariants = signal<string[]>([
    'Standard',
    'Premium',
    'Glossy',
    'Matte',
    'Heavy Duty'
  ]);

  readonly units = signal<string[]>(['ml', 'piece', 'gm', 'kg', 'pkt', 'ltr']);

  readonly packageLabels = signal<string[]>([
    '500ml',
    '1L',
    '2L',
    '5L',
    '10L',
    '20L',
    '50pcs',
    '100pcs',
    '1kg',
    '5kg',
    '10kg'
  ]);

  addCategory(value: string): void {
    this.productCategories.set(this.addUnique(this.productCategories(), value));
  }

  renameCategory(index: number, value: string): void {
    this.productCategories.set(this.renameAt(this.productCategories(), index, value));
  }

  removeCategory(index: number): void {
    this.productCategories.set(this.removeAt(this.productCategories(), index));
  }

  addBrand(value: string): void {
    this.brands.set(this.addUnique(this.brands(), value));
  }

  renameBrand(index: number, value: string): void {
    this.brands.set(this.renameAt(this.brands(), index, value));
  }

  removeBrand(index: number): void {
    this.brands.set(this.removeAt(this.brands(), index));
  }

  addVariant(value: string): void {
    this.productVariants.set(this.addUnique(this.productVariants(), value));
  }

  renameVariant(index: number, value: string): void {
    this.productVariants.set(this.renameAt(this.productVariants(), index, value));
  }

  removeVariant(index: number): void {
    this.productVariants.set(this.removeAt(this.productVariants(), index));
  }

  addUnit(value: string): void {
    this.units.set(this.addUnique(this.units(), value));
  }

  renameUnit(index: number, value: string): void {
    this.units.set(this.renameAt(this.units(), index, value));
  }

  removeUnit(index: number): void {
    this.units.set(this.removeAt(this.units(), index));
  }

  addPackageLabel(value: string): void {
    this.packageLabels.set(this.addUnique(this.packageLabels(), value));
  }

  renamePackageLabel(index: number, value: string): void {
    this.packageLabels.set(this.renameAt(this.packageLabels(), index, value));
  }

  removePackageLabel(index: number): void {
    this.packageLabels.set(this.removeAt(this.packageLabels(), index));
  }

  private addUnique(existing: string[], rawValue: string): string[] {
    const value = rawValue.trim();
    if (!value) {
      return existing;
    }

    const alreadyExists = existing.some(item => item.toLowerCase() === value.toLowerCase());
    if (alreadyExists) {
      return existing;
    }

    return [...existing, value];
  }

  private renameAt(existing: string[], index: number, rawValue: string): string[] {
    const value = rawValue.trim();
    if (!value || index < 0 || index >= existing.length) {
      return existing;
    }

    const duplicate = existing.some((item, i) => i !== index && item.toLowerCase() === value.toLowerCase());
    if (duplicate) {
      return existing;
    }

    return existing.map((item, i) => (i === index ? value : item));
  }

  private removeAt(existing: string[], index: number): string[] {
    if (index < 0 || index >= existing.length) {
      return existing;
    }

    return existing.filter((_, i) => i !== index);
  }
}
