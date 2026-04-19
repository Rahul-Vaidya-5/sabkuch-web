export type CategoryCode =
  | 'CLOTH' | 'HARD' | 'AUTO' | 'HOME' | 'ELEC'
  | 'JEWL'  | 'BOOK' | 'SPORT'| 'PHAR' | 'AGRI' | 'MISC'
  | 'DECO'  | 'FEST' | 'BEAUTY';

/** Kept as alias so existing references still compile */
export type ShopCategory = CategoryCode;

export interface Subcategory {
  code: string;
  name_en: string;
  name_hi: string;
}

export interface Category {
  code: CategoryCode;
  name_en: string;
  name_hi: string;
  subcategories: Subcategory[];
}

export type UserRole = 'Sales' | 'Godam' | 'Manager' | 'Admin';

export interface ShopEntity {
  id: string;
  shopName: string;
  ownerName: string;
  phoneNumber: string;
  category: ShopCategory;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface PermissionItem {
  title: string;
  description: string;
}

export interface RolePermission {
  role: UserRole;
  capabilities: PermissionItem[];
}

export interface ProductVariant {
  label: string;
  unit: string;
  conversionFactor: number;
  sizeLabel: string;
}

export interface ProductPricing {
  packageMrp: number;
  packageSalePrice: number;
  singleUnitMrp: number;
  singleUnitSalePrice: number;
}

export interface ProductDiscount {
  wholesellerNew: number;
  wholesellerOld: number;
  retailerNew: number;
  retailerOld: number;
}

export interface GstDetail {
  gstType: 'CGST_SGST' | 'IGST';
  gstPercent: number;
}

export interface ProductBlueprint {
  productName: string;
  category: string;
  brand: string;
  variant: ProductVariant;
  batchCode: string;
  barcode?: string;
  pricing: ProductPricing;
  discount: ProductDiscount;
  gst: GstDetail;
}

// ── Super Admin domain ──────────────────────────────────────────────────────

export type AppRole = 'SuperAdmin' | 'Admin' | 'Manager' | 'Sales' | 'Godam' | 'ProductManager';

export interface LoggedInUser {
  name: string;
  mobile: string;
  role: AppRole;
  shopName?: string;
}

export interface RegisteredShop {
  shopId: string;
  shopName: string;
  ownerName: string;
  ownerMobile: string;
  categories: CategoryCode[];
  subcategoryCodes: string[];
  city: string;
  area: string;
  registeredOn: string;
  active: boolean;
  monthlyRevenue: number;
  loginCount30d: number;
  lastActivity: string;
}

export interface RegisteredUser {
  userId: string;
  name: string;
  mobile: string;
  role: AppRole;
  shopId: string | null;
  shopName: string;
  active: boolean;
  lastLogin: string;
  loginCount30d: number;
}
