import { Injectable, computed, signal } from '@angular/core';
import { LoggedInUser } from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'global_inventory_current_user';

  readonly currentUser = signal<LoggedInUser | null>(null);
  readonly isLoggedIn  = computed(() => this.currentUser() !== null);

  // Role-specific computed signals
  readonly isSuperAdmin = computed(() => this.currentUser()?.role === 'SuperAdmin');
  readonly isAdmin = computed(() => this.currentUser()?.role === 'Admin');
  readonly isManager = computed(() => this.currentUser()?.role === 'Manager');
  readonly isSalesExecutive = computed(() => this.currentUser()?.role === 'Sales');
  readonly isProductManager = computed(() => this.currentUser()?.role === 'ProductManager');
  readonly isStockKeeper = computed(() => this.currentUser()?.role === 'Godam');

  // Get user's dashboard route
  readonly dashboardRoute = computed(() => {
    const role = this.currentUser()?.role;
    if (!role) return '/login';

    const roleRouteMap: Record<string, string> = {
      'SuperAdmin': '/dashboard/superadmin',
      'Admin': '/dashboard/admin',
      'Manager': '/dashboard/shop-manager',
      'Sales': '/dashboard/sales-executive',
      'ProductManager': '/dashboard/product-manager',
      'Godam': '/dashboard/stock-keeper'
    };

    return roleRouteMap[role] || '/login';
  });

  constructor() {
    this.restoreSession();
  }

  login(user: LoggedInUser): void {
    this.currentUser.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.storageKey);
  }

  private restoreSession(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as LoggedInUser;
      if (parsed?.mobile && parsed?.name && parsed?.role) {
        this.currentUser.set(parsed);
      } else {
        localStorage.removeItem(this.storageKey);
      }
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  }
}
