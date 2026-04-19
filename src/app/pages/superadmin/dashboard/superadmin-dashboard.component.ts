import { Component, inject, signal, computed, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SA_REGISTERED_SHOPS, SA_REGISTERED_USERS, SHOP_CATEGORIES } from '../../../data/inventory.seed';
import { RegisteredShop, RegisteredUser, CategoryCode, AppRole } from '../../../models/inventory.models';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

interface MasterDistrict {
  districtId: number;
  districtNameEnglish: string;
  districtNameHindi: string;
}

interface MasterBlock {
  blockId: number;
  blockNameEnglish: string;
  blockNameHindi: string;
}

interface DistrictMasterResponse {
  state: string;
  districts: MasterDistrict[];
}

interface BlockMasterResponse {
  state: string;
  districts: Array<{ districtId: number; blocks: MasterBlock[] }>;
}

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './superadmin-dashboard.component.html',
  styleUrl: './superadmin-dashboard.component.scss'
})
export class SuperAdminDashboardComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  readonly authService = inject(AuthService);

  readonly shops = signal<RegisteredShop[]>(SA_REGISTERED_SHOPS);
  readonly users = signal<RegisteredUser[]>(SA_REGISTERED_USERS);
  readonly activeTab = signal<'overview' | 'shops' | 'users'>('overview');
  readonly showShopForm = signal(false);
  readonly showUserForm = signal(false);
  readonly shopFormStep = signal<1 | 2 | 3>(1);
  readonly validationEnabled = environment.validationEnabled;
  @ViewChild('categoryPickerRoot') categoryPickerRoot?: ElementRef<HTMLElement>;
  @ViewChild('subcategoryPickerRoot') subcategoryPickerRoot?: ElementRef<HTMLElement>;

  // ── Computed Stats ──────────────────────────────────────────────────────

  readonly totalShops = computed(() => this.shops().length);
  readonly activeShops = computed(() => this.shops().filter(s => s.active).length);
  readonly totalRevenue = computed(() =>
    this.shops()
      .filter(s => s.active)
      .reduce((sum, s) => sum + s.monthlyRevenue, 0)
  );
  readonly totalLogins30d = computed(() =>
    this.users()
      .filter(u => u.active)
      .reduce((sum, u) => sum + u.loginCount30d, 0)
  );
  readonly averageLoginCount = computed(() => {
    const activeCount = this.users().filter(u => u.active).length;
    return activeCount > 0 ? Math.round(this.totalLogins30d() / activeCount) : 0;
  });

  readonly recentShops = computed(() => {
    const sorted = [...this.shops()].sort(
      (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );
    return sorted.slice(0, 5);
  });

  readonly activeUsers = computed(() => this.users().filter(u => u.active).length);
  readonly inactiveUsers = computed(() => this.users().filter(u => !u.active).length);
  readonly currentUserName = computed(() => this.authService.currentUser()?.name ?? 'Super Admin');
  readonly currentUserRole = computed(() => this.authService.currentUser()?.role ?? 'SuperAdmin');
  readonly userInitials = computed(() => {
    const words = this.currentUserName().split(' ').filter(Boolean);
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  });
  readonly pageTitle = computed(() => {
    const titleMap = {
      overview: 'Overview',
      shops: 'Shops Management',
      users: 'User Access Control'
    } as const;

    return titleMap[this.activeTab()];
  });

  // ── Shop Form ───────────────────────────────────────────────────────────

  readonly categories = SHOP_CATEGORIES;
  readonly ownerTitleOptions = ['Mr.', 'Mrs.', 'Dr.', 'Miss'] as const;
  readonly roleLabels: Record<AppRole, string> = {
    SuperAdmin: 'Super Admin',
    Admin: 'Admin',
    Manager: 'Shop Manager',
    Sales: 'Sales',
    Godam: 'Godam',
    ProductManager: 'Product Manager'
  };
  readonly districtMasters = signal<MasterDistrict[]>([]);
  readonly blockMasterByDistrict = signal<Record<number, MasterBlock[]>>({});
  readonly categoryQuery = signal('');
  readonly subcategoryQuery = signal('');
  readonly categoryPickerOpen = signal(false);
  readonly subcategoryPickerOpen = signal(false);

  readonly availableBlocks = computed(() => {
    const districtId = Number(this.shopForm.controls.districtId.value || 0);
    if (!districtId) return [] as MasterBlock[];
    return this.blockMasterByDistrict()[districtId] ?? [];
  });

  readonly subcategories = computed(() => {
    const selectedCategories = this.shopForm.controls.categories.value ?? [];
    if (!selectedCategories.length) return [];

    return this.categories
      .filter(c => selectedCategories.includes(c.code))
      .flatMap(c => c.subcategories);
  });

  readonly filteredCategories = computed(() => {
    const query = this.categoryQuery().trim().toLowerCase();
    if (!query) return this.categories;

    return this.categories.filter(category => {
      const name = category.name_en.toLowerCase();
      const code = category.code.toLowerCase();
      return name.includes(query) || code.includes(query);
    });
  });

  readonly filteredSubcategories = computed(() => {
    const query = this.subcategoryQuery().trim().toLowerCase();
    const availableSubcategories = this.subcategories();
    if (!query) return availableSubcategories;

    return availableSubcategories.filter(subcategory => {
      const name = subcategory.name_en.toLowerCase();
      const code = subcategory.code.toLowerCase();
      return name.includes(query) || code.includes(query);
    });
  });

  readonly shopForm = this.fb.group({
    shopName: ['', [Validators.required]],
    knownName: [''],
    contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    licenceNumber: ['', [Validators.required]],
    categories: [[] as CategoryCode[], [Validators.required]],
    subcategoryCodes: [[] as string[], [Validators.required]],
    addressLine1: ['', [Validators.required]],
    addressLine2: [''],
    landmark: [''],
    districtId: ['', [Validators.required]],
    blockId: ['', [Validators.required]],
    pinCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    shopImageName: [''],
    ownerTitle: ['Mr.', [Validators.required]],
    ownerName: ['', [Validators.required]],
    ownerMobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    ownerDob: ['', [Validators.required]],
    ownerAlsoAdmin: [false],
    adminName: ['', [Validators.required]],
    adminMobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    managerName: ['', [Validators.required]],
    managerMobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    salesName: ['', [Validators.required]],
    salesMobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    productManagerName: ['', [Validators.required]],
    productManagerMobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    stockKeeperName: ['', [Validators.required]],
    stockKeeperMobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    ownerProfileImageName: [''],
    reviewAck: [false, [Validators.requiredTrue]]
  });

  private readonly shopStepOneControls = [
    'shopName',
    'contactNumber',
    'licenceNumber',
    'categories',
    'subcategoryCodes',
    'addressLine1',
    'districtId',
    'blockId',
    'pinCode'
  ] as const;

  private readonly shopStepTwoControls = [
    'ownerTitle',
    'ownerName',
    'ownerMobile',
    'ownerDob',
    'adminName',
    'adminMobile',
    'managerName',
    'managerMobile',
    'salesName',
    'salesMobile',
    'productManagerName',
    'productManagerMobile',
    'stockKeeperName',
    'stockKeeperMobile'
  ] as const;

  // ── User Form ───────────────────────────────────────────────────────────

  readonly availableShops = computed(() => this.shops().filter(shop => shop.active));
  readonly userRoleOptions: AppRole[] = ['Admin', 'Manager', 'Sales', 'Godam', 'ProductManager'];

  readonly userForm = this.fb.group({
    name: ['', [Validators.required]],
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    role: ['Sales', [Validators.required]],
    shopId: ['', [Validators.required]]
  });

  constructor() {
    this.loadDistrictMaster();
    this.loadBlockMaster();
    this.shopForm.controls.districtId.valueChanges.subscribe(() => {
      this.shopForm.controls.blockId.setValue('');
    });
    this.shopForm.controls.categories.valueChanges.subscribe(() => {
      this.shopForm.controls.subcategoryCodes.setValue([]);
      this.subcategoryQuery.set('');
      if (!(this.shopForm.controls.categories.value ?? []).length) {
        this.subcategoryPickerOpen.set(false);
      }
    });

    this.shopForm.controls.ownerAlsoAdmin.valueChanges.subscribe(isChecked => {
      if (isChecked) {
        this.syncAdminFromOwner();
      }
      this.setAdminControlsState();
    });

    this.shopForm.controls.ownerName.valueChanges.subscribe(() => {
      if (this.shopForm.controls.ownerAlsoAdmin.value) {
        this.shopForm.controls.adminName.setValue(this.shopForm.controls.ownerName.value ?? '', { emitEvent: false });
      }
    });

    this.shopForm.controls.ownerMobile.valueChanges.subscribe(() => {
      if (this.shopForm.controls.ownerAlsoAdmin.value) {
        this.shopForm.controls.adminMobile.setValue(this.shopForm.controls.ownerMobile.value ?? '', { emitEvent: false });
      }
    });

    this.setAdminControlsState();
  }

  // ── Methods ─────────────────────────────────────────────────────────────

  setTab(tab: 'overview' | 'shops' | 'users'): void {
    this.activeTab.set(tab);
    if (tab !== 'shops') {
      this.showShopForm.set(false);
      this.shopForm.reset();
      this.shopForm.patchValue({ ownerTitle: 'Mr.', ownerAlsoAdmin: false });
      this.setAdminControlsState();
      this.shopFormStep.set(1);
    }

    if (tab !== 'users') {
      this.showUserForm.set(false);
      this.userForm.reset({ role: 'Sales' });
    }
  }

  toggleShopActive(shopId: string): void {
    const updated = this.shops().map(s => ({
      ...s,
      active: s.shopId === shopId ? !s.active : s.active
    }));
    this.shops.set(updated);
  }

  toggleUserActive(userId: string): void {
    const updated = this.users().map(u => ({
      ...u,
      active: u.userId === userId ? !u.active : u.active
    }));
    this.users.set(updated);
  }

  toggleShopForm(): void {
    this.showShopForm.set(!this.showShopForm());
    this.shopFormStep.set(1);
    if (!this.showShopForm()) {
      this.shopForm.reset();
      this.shopForm.patchValue({ ownerTitle: 'Mr.', ownerAlsoAdmin: false, reviewAck: false, categories: [], subcategoryCodes: [] });
      this.setAdminControlsState();
      this.categoryQuery.set('');
      this.subcategoryQuery.set('');
      this.categoryPickerOpen.set(false);
      this.subcategoryPickerOpen.set(false);
      return;
    }

    this.shopForm.patchValue({ ownerTitle: 'Mr.', ownerAlsoAdmin: false, reviewAck: false, categories: [], subcategoryCodes: [] });
    this.setAdminControlsState();
    this.categoryQuery.set('');
    this.subcategoryQuery.set('');
  }

  goToNextShopStep(): void {
    const currentStep = this.shopFormStep();
    if (!this.validationEnabled) {
      this.shopFormStep.set(currentStep === 1 ? 2 : 3);
      return;
    }

    const controlsToCheck = currentStep === 1 ? this.shopStepOneControls : this.shopStepTwoControls;

    controlsToCheck.forEach(controlName => this.shopForm.controls[controlName].markAsTouched());

    const hasErrors = controlsToCheck.some(controlName => this.shopForm.controls[controlName].invalid);
    if (hasErrors) return;

    this.shopFormStep.set(currentStep === 1 ? 2 : 3);
  }

  goToPreviousShopStep(): void {
    const currentStep = this.shopFormStep();
    if (currentStep > 1) {
      this.shopFormStep.set((currentStep - 1) as 1 | 2 | 3);
    }
  }

  onFilePicked(controlName: 'shopImageName' | 'ownerProfileImageName', event: Event): void {
    const input = event.target as HTMLInputElement;
    const fileName = input.files?.[0]?.name ?? '';
    this.shopForm.controls[controlName].setValue(fileName);
  }

  submitShop(): void {
    if (this.validationEnabled) {
      this.shopForm.controls.reviewAck.markAsTouched();
      if (!this.shopForm.valid) return;
    }

    const formValue = this.shopForm.value;
    const districtName = this.getDistrictLabelById(formValue.districtId);
    const blockName = this.getBlockLabelById(formValue.districtId, formValue.blockId);
    const newShopId = `SHP-${String(this.shops().length + 1).padStart(3, '0')}`;
    const selectedCategories = (formValue.categories ?? []) as CategoryCode[];
    const selectedSubcategories = (formValue.subcategoryCodes ?? []) as string[];
    const newShop: RegisteredShop = {
      shopId: newShopId,
      shopName: formValue.shopName ?? '',
      ownerName: formValue.ownerName ?? '',
      ownerMobile: formValue.ownerMobile ?? '',
      categories: selectedCategories,
      subcategoryCodes: selectedSubcategories,
      city: districtName,
      area: blockName || formValue.landmark || formValue.addressLine1 || '',
      registeredOn: new Date().toISOString().split('T')[0],
      active: true,
      monthlyRevenue: 0,
      loginCount30d: 0,
      lastActivity: new Date().toISOString().split('T')[0]
    };

    this.shops.set([...this.shops(), newShop]);

    const currentUsers = this.users();
    const roleContacts: Array<{ role: AppRole; name: string; mobile: string }> = [
      { role: 'Admin', name: formValue.adminName ?? '', mobile: formValue.adminMobile ?? '' },
      { role: 'Manager', name: formValue.managerName ?? '', mobile: formValue.managerMobile ?? '' },
      { role: 'Sales', name: formValue.salesName ?? '', mobile: formValue.salesMobile ?? '' },
      { role: 'ProductManager', name: formValue.productManagerName ?? '', mobile: formValue.productManagerMobile ?? '' },
      { role: 'Godam', name: formValue.stockKeeperName ?? '', mobile: formValue.stockKeeperMobile ?? '' }
    ];

    const ownerUsers: RegisteredUser[] = roleContacts.map((entry, index) => ({
      userId: `USR-${String(currentUsers.length + index + 1).padStart(3, '0')}`,
      name: entry.name,
      mobile: entry.mobile,
      role: entry.role,
      shopId: newShopId,
      shopName: formValue.shopName ?? '',
      active: true,
      lastLogin: new Date().toISOString().split('T')[0],
      loginCount30d: 0
    }));

    this.users.set([...currentUsers, ...ownerUsers]);
    this.shopForm.reset();
  this.shopForm.patchValue({ ownerTitle: 'Mr.', ownerAlsoAdmin: false, reviewAck: false, categories: [], subcategoryCodes: [] });
  this.setAdminControlsState();
    this.categoryQuery.set('');
    this.subcategoryQuery.set('');
    this.categoryPickerOpen.set(false);
    this.subcategoryPickerOpen.set(false);
    this.shopFormStep.set(1);
    this.showShopForm.set(false);
  }

  openCategoryPicker(): void {
    this.categoryPickerOpen.set(true);
  }

  openSubcategoryPicker(): void {
    if (!this.hasSelectedCategories()) return;
    this.subcategoryPickerOpen.set(true);
  }

  closeCategoryPicker(): void {
    this.categoryPickerOpen.set(false);
  }

  closeSubcategoryPicker(): void {
    this.subcategoryPickerOpen.set(false);
  }

  onCategoryFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget as Node | null;
    const root = this.categoryPickerRoot?.nativeElement;
    if (root && nextTarget && root.contains(nextTarget)) return;
    this.closeCategoryPicker();
  }

  onSubcategoryFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget as Node | null;
    const root = this.subcategoryPickerRoot?.nativeElement;
    if (root && nextTarget && root.contains(nextTarget)) return;
    this.closeSubcategoryPicker();
  }

  setCategoryQuery(query: string): void {
    this.categoryQuery.set(query);
    this.categoryPickerOpen.set(true);
  }

  setSubcategoryQuery(query: string): void {
    this.subcategoryQuery.set(query);
    if (this.hasSelectedCategories()) {
      this.subcategoryPickerOpen.set(true);
    }
  }

  hasSelectedCategories(): boolean {
    return (this.shopForm.controls.categories.value ?? []).length > 0;
  }

  isCategorySelected(code: CategoryCode): boolean {
    return (this.shopForm.controls.categories.value ?? []).includes(code);
  }

  isSubcategorySelected(code: string): boolean {
    return (this.shopForm.controls.subcategoryCodes.value ?? []).includes(code);
  }

  toggleCategorySelection(code: CategoryCode): void {
    const selected = [...(this.shopForm.controls.categories.value ?? [])];
    const index = selected.indexOf(code);
    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(code);
    }
    this.shopForm.controls.categories.setValue(selected);
    this.shopForm.controls.categories.markAsTouched();
  }

  toggleSubcategorySelection(code: string): void {
    if (!this.hasSelectedCategories()) return;

    const selected = [...(this.shopForm.controls.subcategoryCodes.value ?? [])];
    const index = selected.indexOf(code);
    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(code);
    }
    this.shopForm.controls.subcategoryCodes.setValue(selected);
    this.shopForm.controls.subcategoryCodes.markAsTouched();
  }

  removeCategoryTag(code: CategoryCode): void {
    const selected = (this.shopForm.controls.categories.value ?? []).filter(value => value !== code);
    this.shopForm.controls.categories.setValue(selected);
    this.shopForm.controls.categories.markAsTouched();
  }

  removeSubcategoryTag(code: string): void {
    const selected = (this.shopForm.controls.subcategoryCodes.value ?? []).filter(value => value !== code);
    this.shopForm.controls.subcategoryCodes.setValue(selected);
    this.shopForm.controls.subcategoryCodes.markAsTouched();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    const categoryRoot = this.categoryPickerRoot?.nativeElement;
    const subcategoryRoot = this.subcategoryPickerRoot?.nativeElement;

    if (categoryRoot && target && !categoryRoot.contains(target)) {
      this.closeCategoryPicker();
    }

    if (subcategoryRoot && target && !subcategoryRoot.contains(target)) {
      this.closeSubcategoryPicker();
    }
  }

  toggleUserForm(): void {
    this.showUserForm.set(!this.showUserForm());
    if (!this.showUserForm()) {
      this.userForm.reset({ role: 'Sales' });
    }
  }

  submitUser(): void {
    if (this.validationEnabled && !this.userForm.valid) return;

    const formValue = this.userForm.value;
    const selectedShop = this.shops().find(shop => shop.shopId === formValue.shopId);
    if (!selectedShop) return;

    const newUserId = `USR-${String(this.users().length + 1).padStart(3, '0')}`;
    const newUser: RegisteredUser = {
      userId: newUserId,
      name: formValue.name ?? '',
      mobile: formValue.mobile ?? '',
      role: (formValue.role ?? 'Sales') as RegisteredUser['role'],
      shopId: selectedShop.shopId,
      shopName: selectedShop.shopName,
      active: true,
      lastLogin: new Date().toISOString().split('T')[0],
      loginCount30d: 0
    };

    this.users.set([...this.users(), newUser]);
    this.userForm.reset({ role: 'Sales' });
    this.showUserForm.set(false);
  }

  getShopNameById(shopId: string | null): string {
    if (!shopId) return '-';
    return this.shops().find(shop => shop.shopId === shopId)?.shopName ?? '-';
  }

  getCategoryLabel(code: string | null): string {
    if (!code) return '-';
    return this.categories.find(c => c.code === code)?.name_en ?? code;
  }

  getCategoryLabels(codes: string[] | null | undefined): string {
    if (!codes || !codes.length) return '-';
    return codes.map(code => this.getCategoryLabel(code)).join(', ');
  }

  getDistrictLabelById(districtId: string | null | undefined): string {
    const id = Number(districtId || 0);
    if (!id) return '-';
    return this.districtMasters().find(d => d.districtId === id)?.districtNameEnglish ?? '-';
  }

  getBlockLabelById(districtId: string | null | undefined, blockId: string | null | undefined): string {
    const dId = Number(districtId || 0);
    const bId = Number(blockId || 0);
    if (!dId || !bId) return '-';

    return this.blockMasterByDistrict()[dId]?.find(b => b.blockId === bId)?.blockNameEnglish ?? '-';
  }

  getSubcategoryLabel(code: string): string {
    for (const cat of this.categories) {
      const sub = cat.subcategories.find(s => s.code === code);
      if (sub) return sub.name_en;
    }
    return code;
  }

  getSubcategoryLabels(codes: string[] | null | undefined): string {
    if (!codes || !codes.length) return '-';
    return codes.map(code => this.getSubcategoryLabel(code)).join(', ');
  }

  getRoleLabel(role: AppRole): string {
    return this.roleLabels[role] ?? role;
  }

  getRoleClass(role: AppRole): string {
    return `role-${role.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
  }

  private syncAdminFromOwner(): void {
    this.shopForm.controls.adminName.setValue(this.shopForm.controls.ownerName.value ?? '', { emitEvent: false });
    this.shopForm.controls.adminMobile.setValue(this.shopForm.controls.ownerMobile.value ?? '', { emitEvent: false });
  }

  private setAdminControlsState(): void {
    if (this.shopForm.controls.ownerAlsoAdmin.value) {
      this.shopForm.controls.adminName.disable({ emitEvent: false });
      this.shopForm.controls.adminMobile.disable({ emitEvent: false });
      return;
    }

    this.shopForm.controls.adminName.enable({ emitEvent: false });
    this.shopForm.controls.adminMobile.enable({ emitEvent: false });
  }

  private loadDistrictMaster(): void {
    this.http.get<DistrictMasterResponse>('assets/master/district.json').subscribe({
      next: response => this.districtMasters.set(response.districts ?? []),
      error: () => this.districtMasters.set([])
    });
  }

  private loadBlockMaster(): void {
    this.http.get<BlockMasterResponse>('assets/master/block.json').subscribe({
      next: response => {
        const mapped: Record<number, MasterBlock[]> = {};
        for (const district of response.districts ?? []) {
          mapped[district.districtId] = district.blocks ?? [];
        }
        this.blockMasterByDistrict.set(mapped);
      },
      error: () => this.blockMasterByDistrict.set({})
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
