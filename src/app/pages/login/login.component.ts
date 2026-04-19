import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

type LoginStage = 'mobile' | 'password' | 'not-registered' | 'authenticated';
type AppRole = 'SuperAdmin' | 'Admin' | 'Manager' | 'Sales' | 'Godam' | 'ProductManager';

interface UserRecord { password: string; role: AppRole; name: string; shopName?: string; }

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private readonly registeredUsers = new Map<string, UserRecord>([
    ['9131354481', { password: 'Asha@1964',    role: 'SuperAdmin',     name: 'Super Admin',    shopName: 'Global Admin' }],
    ['9876500001', { password: 'admin1234',    role: 'Admin',          name: 'Shop Admin',     shopName: 'Techmart Hardware' }],
    ['9876500002', { password: 'manager1234',  role: 'Manager',        name: 'Shop Manager',   shopName: 'Techmart Hardware' }],
    ['9876500003', { password: 'sales1234',    role: 'Sales',          name: 'Sales Exec',     shopName: 'Techmart Hardware' }],
    ['9876500004', { password: 'product1234',  role: 'ProductManager', name: 'Product Mamager',    shopName: 'Techmart Hardware' }],
    ['9876500005', { password: 'godam1234',    role: 'Godam',          name: 'Stock Keeper',   shopName: 'Techmart Hardware' }]
  ]);

  readonly stage = signal<LoginStage>('mobile');
  readonly passwordError = signal('');
  readonly loggedInUser = signal<UserRecord | null>(null);
  readonly validationEnabled = environment.validationEnabled;

  readonly loginForm = this.fb.group({
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    password: ['']
  });

  onMobileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '').slice(0, 10);

    if (input.value !== digitsOnly) {
      input.value = digitsOnly;
    }

    this.loginForm.controls.mobile.setValue(digitsOnly, { emitEvent: false });

    if (this.stage() !== 'mobile') {
      this.stage.set('mobile');
      this.passwordError.set('');
      this.loginForm.controls.password.clearValidators();
      this.loginForm.controls.password.setValue('');
      this.loginForm.controls.password.updateValueAndValidity();
    }
  }

  checkMobile(): void {
    const mobileControl = this.loginForm.controls.mobile;
    if (this.validationEnabled) {
      mobileControl.markAsTouched();
    }

    if (this.validationEnabled && mobileControl.invalid) {
      return;
    }

    const mobile = mobileControl.value ?? '';
    this.passwordError.set('');

    if (this.registeredUsers.has(mobile)) {
      this.stage.set('password');
      if (this.validationEnabled) {
        this.loginForm.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
      }
      this.loginForm.controls.password.updateValueAndValidity();
      return;
    }

    this.stage.set('not-registered');
    this.loginForm.controls.password.clearValidators();
    this.loginForm.controls.password.setValue('');
    this.loginForm.controls.password.updateValueAndValidity();
  }

  tryAgain(): void {
    this.stage.set('mobile');
    this.passwordError.set('');
    this.loginForm.controls.mobile.setValue('');
    this.loginForm.controls.mobile.markAsUntouched();
    this.loginForm.controls.password.clearValidators();
    this.loginForm.controls.password.setValue('');
    this.loginForm.controls.password.updateValueAndValidity();
  }

  login(): void {
    const passwordControl = this.loginForm.controls.password;
    if (this.validationEnabled) {
      passwordControl.markAsTouched();
    }

    if (this.validationEnabled && passwordControl.invalid) {
      return;
    }

    const mobile = this.loginForm.controls.mobile.value ?? '';
    const password = passwordControl.value ?? '';
    const record = this.registeredUsers.get(mobile);

    if (!record || record.password !== password) {
      this.passwordError.set('Incorrect password. Please try again.');
      this.stage.set('password');
      return;
    }

    this.passwordError.set('');
    this.loggedInUser.set(record);
    this.authService.login({ name: record.name, mobile, role: record.role, shopName: record.shopName });

    // Redirect to dashboard after brief delay
    setTimeout(() => {
      this.router.navigate([this.authService.dashboardRoute()]);
    }, 800);

    this.stage.set('authenticated');
  }

  isMobileInvalid(): boolean {
    if (!this.validationEnabled) return false;
    const mobileControl = this.loginForm.controls.mobile;
    return mobileControl.touched && mobileControl.invalid;
  }

  isPasswordInvalid(): boolean {
    if (!this.validationEnabled) return false;
    const passwordControl = this.loginForm.controls.password;
    return passwordControl.touched && passwordControl.invalid;
  }
}
