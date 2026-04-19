import { Component, computed, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SHOP_CATEGORIES } from '../../../data/inventory.seed';

@Component({
  selector: 'app-shop-registration',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './shop-registration.component.html',
  styleUrl: './shop-registration.component.scss'
})
export class ShopRegistrationComponent {
  private readonly fb = inject(FormBuilder);

  readonly categories = SHOP_CATEGORIES;
  readonly submitted = signal(false);

  readonly registrationForm = this.fb.group({
    shopName: ['', [Validators.required, Validators.minLength(3)]],
    ownerName: ['', [Validators.required, Validators.minLength(3)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    category: ['', Validators.required],
    address: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pinCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
  });

  readonly payload = computed(() => this.registrationForm.getRawValue());

  submit(): void {
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.invalid) {
      this.submitted.set(false);
      return;
    }

    this.submitted.set(true);
  }

  hasError(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return Boolean(control && control.touched && control.invalid);
  }
}
