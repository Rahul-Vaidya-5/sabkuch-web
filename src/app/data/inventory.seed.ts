import { Category, ProductBlueprint, RegisteredShop, RegisteredUser, RolePermission, ShopCategory } from '../models/inventory.models';

export const SHOP_CATEGORIES: Category[] = [
  {
    code: 'CLOTH', name_en: 'Clothing & Apparel', name_hi: 'वस्त्र और परिधान',
    subcategories: [
      { code: 'CLOTH-MKT',  name_en: 'Cloth Market',       name_hi: 'कपड़ा बाजार' },
      { code: 'CLOTH-BOUT', name_en: 'Boutiques',           name_hi: 'बुटीक' },
      { code: 'CLOTH-FTWR', name_en: 'Footwear',            name_hi: 'जूते' },
      { code: 'CLOTH-TLR',  name_en: 'Tailoring Services',  name_hi: 'सिलाई सेवाएं' }
    ]
  },
  {
    code: 'HARD', name_en: 'Hardware & Construction', name_hi: 'हार्डवेयर और निर्माण',
    subcategories: [
      { code: 'HARD-MAT',   name_en: 'Building Materials',  name_hi: 'निर्माण सामग्री' },
      { code: 'HARD-PLMB',  name_en: 'Plumbing Supplies',   name_hi: 'प्लंबिंग सामग्री' },
      { code: 'HARD-ELC',   name_en: 'Electrical Supplies', name_hi: 'बिजली सामग्री' },
      { code: 'HARD-PAINT', name_en: 'Paint Shops',         name_hi: 'पेंट की दुकानें' }
    ]
  },
  {
    code: 'AUTO', name_en: 'Automotive', name_hi: 'ऑटोमोबाइल',
    subcategories: [
      { code: 'AUTO-CAR',   name_en: 'Car Accessories',   name_hi: 'कार एक्सेसरीज़' },
      { code: 'AUTO-BIKE',  name_en: 'Bike Accessories',  name_hi: 'बाइक एक्सेसरीज़' },
      { code: 'AUTO-SPARE', name_en: 'Spare Parts',       name_hi: 'स्पेयर पार्ट्स' },
      { code: 'AUTO-SVC',   name_en: 'Service Centers',   name_hi: 'सर्विस सेंटर' }
    ]
  },
  {
    code: 'HOME', name_en: 'Home & Living', name_hi: 'घर और जीवन',
    subcategories: [
      { code: 'HOME-DECOR', name_en: 'Home Decor',     name_hi: 'होम डेकोर' },
      { code: 'HOME-FURN',  name_en: 'Furniture',      name_hi: 'फर्नीचर' },
      { code: 'HOME-KITCH', name_en: 'Kitchenware',    name_hi: 'रसोई सामग्री' },
      { code: 'HOME-SAN',   name_en: 'Sanitary Ware',  name_hi: 'सैनिटरी सामान' }
    ]
  },
  {
    code: 'ELEC', name_en: 'Electronics & Appliances', name_hi: 'इलेक्ट्रॉनिक्स और उपकरण',
    subcategories: [
      { code: 'ELEC-MOB',  name_en: 'Mobile Shops',         name_hi: 'मोबाइल दुकानें' },
      { code: 'ELEC-COMP', name_en: 'Computer Stores',      name_hi: 'कंप्यूटर दुकानें' },
      { code: 'ELEC-CONS', name_en: 'Consumer Electronics', name_hi: 'उपभोक्ता इलेक्ट्रॉनिक्स' },
      { code: 'ELEC-REP',  name_en: 'Repair Services',      name_hi: 'मरम्मत सेवाएं' }
    ]
  },
  {
    code: 'JEWL', name_en: 'Jewelry & Accessories', name_hi: 'आभूषण और एक्सेसरीज़',
    subcategories: [
      { code: 'JEWL-GOLD',  name_en: 'Gold Jewelry',      name_hi: 'सोने के आभूषण' },
      { code: 'JEWL-SILV',  name_en: 'Silver Jewelry',    name_hi: 'चांदी के आभूषण' },
      { code: 'JEWL-IMIT',  name_en: 'Imitation Jewelry', name_hi: 'नकली आभूषण' },
      { code: 'JEWL-WATCH', name_en: 'Watches',           name_hi: 'घड़ियां' }
    ]
  },
  {
    code: 'BOOK', name_en: 'Books & Stationery', name_hi: 'पुस्तकें और स्टेशनरी',
    subcategories: [
      { code: 'BOOK-STORE', name_en: 'Bookstores',         name_hi: 'पुस्तकालय' },
      { code: 'BOOK-STAT',  name_en: 'Stationery',         name_hi: 'स्टेशनरी' },
      { code: 'BOOK-PRINT', name_en: 'Printing Services',  name_hi: 'प्रिंटिंग सेवाएं' },
      { code: 'BOOK-OFF',   name_en: 'Office Supplies',    name_hi: 'ऑफिस सामग्री' }
    ]
  },
  {
    code: 'SPORT', name_en: 'Sports & Fitness', name_hi: 'खेल और फिटनेस',
    subcategories: [
      { code: 'SPORT-GOODS', name_en: 'Sports Goods',   name_hi: 'खेल सामग्री' },
      { code: 'SPORT-GYM',   name_en: 'Gym Equipment',  name_hi: 'जिम उपकरण' },
      { code: 'SPORT-CYCLE', name_en: 'Cycles',         name_hi: 'साइकिल' }
    ]
  },
  {
    code: 'PHAR', name_en: 'Pharmacy & Medical', name_hi: 'फार्मेसी और मेडिकल',
    subcategories: [
      { code: 'PHAR-CHEM',  name_en: 'Chemists',          name_hi: 'केमिस्ट' },
      { code: 'PHAR-EQUIP', name_en: 'Medical Equipment',  name_hi: 'मेडिकल उपकरण' },
      { code: 'PHAR-OPT',   name_en: 'Opticals',           name_hi: 'ऑप्टिकल्स' }
    ]
  },
  {
    code: 'AGRI', name_en: 'Agriculture & Tools', name_hi: 'कृषि और उपकरण',
    subcategories: [
      { code: 'AGRI-SEED',  name_en: 'Seeds',          name_hi: 'बीज' },
      { code: 'AGRI-FERT',  name_en: 'Fertilizers',    name_hi: 'खाद' },
      { code: 'AGRI-TOOLS', name_en: 'Farming Tools',  name_hi: 'कृषि उपकरण' },
      { code: 'AGRI-MACH',  name_en: 'Machinery',      name_hi: 'मशीनरी' }
    ]
  },
  {
    code: 'MISC', name_en: 'Miscellaneous Specialty', name_hi: 'विविध विशेष',
    subcategories: [
      { code: 'MISC-TOY',  name_en: 'Toy Shops',   name_hi: 'खिलौने की दुकानें' },
      { code: 'MISC-GIFT', name_en: 'Gift Shops',   name_hi: 'उपहार की दुकानें' },
      { code: 'MISC-ART',  name_en: 'Art & Craft',  name_hi: 'कला और शिल्प' },
      { code: 'MISC-PET',  name_en: 'Pet Supplies', name_hi: 'पशु सामग्री' }
    ]
  },
  {
    code: 'DECO', name_en: 'Decoration & Event Supplies', name_hi: 'सजावट और आयोजन सामग्री',
    subcategories: [
      { code: 'DECO-EVENT',  name_en: 'Event Decoration',          name_hi: 'आयोजन सजावट' },
      { code: 'DECO-WED',    name_en: 'Wedding Decoration',        name_hi: 'विवाह सजावट' },
      { code: 'DECO-FLOW',   name_en: 'Flower Decoration',         name_hi: 'फूल सजावट' },
      { code: 'DECO-SHRING', name_en: 'Shringar Saman',            name_hi: 'श्रृंगार सामान' },
      { code: 'DECO-COLOR',  name_en: 'Colors & Festive Items',    name_hi: 'रंग और उत्सव सामग्री' }
    ]
  },
  {
    code: 'FEST', name_en: 'Festivals & Traditions', name_hi: 'त्योहार और परंपराएं',
    subcategories: [
      { code: 'FEST-PUJA',   name_en: 'Puja Essentials',               name_hi: 'पूजा सामग्री' },
      { code: 'FEST-ACCESS', name_en: 'Festive Accessories',           name_hi: 'त्योहार सजावट' },
      { code: 'FEST-SHRING', name_en: 'Shringar & Ritual Items',       name_hi: 'श्रृंगार और अनुष्ठान सामग्री' },
      { code: 'FEST-SEASON', name_en: 'Seasonal Festive Goods',        name_hi: 'मौसमी त्योहार सामग्री' },
      { code: 'FEST-HANDI',  name_en: 'Cultural Handicrafts',          name_hi: 'सांस्कृतिक हस्तशिल्प' }
    ]
  },
  {
    code: 'BEAUTY', name_en: 'Beauty & Personal Care', name_hi: 'सौंदर्य और व्यक्तिगत देखभाल',
    subcategories: [
      { code: 'BEAUTY-MAKEUP', name_en: 'Cosmetics & Makeup',      name_hi: 'कॉस्मेटिक्स और मेकअप' },
      { code: 'BEAUTY-SKIN',   name_en: 'Skincare Products',       name_hi: 'त्वचा देखभाल उत्पाद' },
      { code: 'BEAUTY-HAIR',   name_en: 'Hair Care',               name_hi: 'बालों की देखभाल' },
      { code: 'BEAUTY-FRAG',   name_en: 'Fragrances & Perfumes',   name_hi: 'सुगंध और इत्र' },
      { code: 'BEAUTY-GROOM',  name_en: 'Personal Grooming',       name_hi: 'व्यक्तिगत सौंदर्य देखभाल' }
    ]
  }
];

/** @deprecated use SHOP_CATEGORIES */
export const ALLOWED_SHOP_CATEGORIES = SHOP_CATEGORIES.map(c => c.code as ShopCategory);

export const BLOCKED_CATEGORY_LABEL = 'Grocery Shop (Kirana Dukan) is not allowed in this solution.';

export const ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: 'Sales',
    capabilities: [
      { title: 'Billing', description: 'Generate bill, cancel bill, and return processing.' },
      { title: 'Store Stock Placement', description: 'Receive stock from Godam and place it in store locations.' },
      { title: 'Store Visibility', description: 'View stock currently available in the store.' }
    ]
  },
  {
    role: 'Godam',
    capabilities: [
      { title: 'Stock Intake', description: 'Enter product quantities and warehouse location details.' },
      { title: 'Godam Locationing', description: 'Maintain room, section, rack, and cell mapping for stock.' },
      { title: 'Stock Control', description: 'Cancel wrong entries, mark dead stock, and dispatch to shop.' }
    ]
  },
  {
    role: 'Manager',
    capabilities: [
      { title: 'Product Entry', description: 'Create and update master catalog with variants and units.' },
      { title: 'Pricing', description: 'Set package and single-unit MRP and sale prices.' },
      { title: 'Discount Rules', description: 'Manage wholeseller and retailer slabs for new and old customers.' },
      { title: 'Tax Setup', description: 'Configure GST type and GST percentage.' }
    ]
  },
  {
    role: 'Admin',
    capabilities: [
      { title: 'Global Access', description: 'Access all role actions and all inventory workflows.' },
      { title: 'Operations', description: 'Monitor attendance, stock movement, and dashboards.' },
      { title: 'Finance', description: 'Manage purchase orders, cash flow, income, and expenses.' }
    ]
  }
];

export const SAMPLE_MANAGER_BLUEPRINTS: ProductBlueprint[] = [
  {
    productName: 'Industrial Cleaner',
    category: 'Cleaning Liquids',
    brand: 'ShinePro',
    variant: { label: '500 ML', unit: 'ml', conversionFactor: 1, sizeLabel: '1 bottle' },
    batchCode: 'CLN-APR26-A1',
    barcode: '8901234567891',
    pricing: {
      packageMrp: 240,
      packageSalePrice: 220,
      singleUnitMrp: 240,
      singleUnitSalePrice: 220
    },
    discount: {
      wholesellerNew: 7,
      wholesellerOld: 10,
      retailerNew: 3,
      retailerOld: 5
    },
    gst: {
      gstType: 'CGST_SGST',
      gstPercent: 18
    }
  },
  {
    productName: 'Decorative LED Strip',
    category: 'Home Decor Lighting',
    brand: 'GlowFlex',
    variant: { label: '1 Unit', unit: 'piece', conversionFactor: 1, sizeLabel: '1 roll' },
    batchCode: 'LED-APR26-B7',
    pricing: {
      packageMrp: 950,
      packageSalePrice: 870,
      singleUnitMrp: 950,
      singleUnitSalePrice: 870
    },
    discount: {
      wholesellerNew: 8,
      wholesellerOld: 12,
      retailerNew: 4,
      retailerOld: 6
    },
    gst: {
      gstType: 'IGST',
      gstPercent: 12
    }
  }
];

export interface ShopListing {
  shopId: string;
  shopName: string;
  category: ShopCategory;
  subcategoryCode: string;
  city: string;
  area: string;
  contactNumber: string;
  products: ShopProduct[];
}

export interface ShopProduct {
  productName: string;
  brand: string;
  variant: string;
  mrp: number;
  salePrice: number;
  unit: string;
  available: boolean;
}

export const PUBLIC_SHOP_LISTINGS: ShopListing[] = [
  {
    shopId: 'SHP-001',
    shopName: 'Raj Hardware Store',
    category: 'HARD',
    subcategoryCode: 'HARD-MAT',
    city: 'Raipur',
    area: 'Pandri',
    contactNumber: '9876500001',
    products: [
      { productName: 'Industrial Drill Bit Set', brand: 'Bosch', variant: '13 Piece', mrp: 850, salePrice: 780, unit: 'Set', available: true },
      { productName: 'PVC Pipe', brand: 'Ashirwad', variant: '1 inch / 3m', mrp: 120, salePrice: 110, unit: 'Piece', available: true },
      { productName: 'Wall Putty', brand: 'Birla White', variant: '20 kg Bag', mrp: 520, salePrice: 490, unit: 'Bag', available: false }
    ]
  },
  {
    shopId: 'SHP-002',
    shopName: 'SpeedZone Tyre Shop',
    category: 'AUTO',
    subcategoryCode: 'AUTO-BIKE',
    city: 'Bilaspur',
    area: 'Torwa',
    contactNumber: '9876500002',
    products: [
      { productName: 'MRF Zapper Tyre', brand: 'MRF', variant: '90/100-10', mrp: 1800, salePrice: 1650, unit: 'Piece', available: true },
      { productName: 'CEAT Bike Tyre', brand: 'CEAT', variant: '2.75-18', mrp: 1550, salePrice: 1420, unit: 'Piece', available: true },
      { productName: 'Tube Tyre Set', brand: 'Birla', variant: '3.00-18', mrp: 950, salePrice: 880, unit: 'Set', available: true }
    ]
  },
  {
    shopId: 'SHP-003',
    shopName: 'PowerCell Battery Hub',
    category: 'AUTO',
    subcategoryCode: 'AUTO-SPARE',
    city: 'Durg',
    area: 'Supela',
    contactNumber: '9876500003',
    products: [
      { productName: 'Exide Car Battery', brand: 'Exide', variant: '35Ah', mrp: 3800, salePrice: 3500, unit: 'Piece', available: true },
      { productName: 'Amaron Bike Battery', brand: 'Amaron', variant: '9Ah', mrp: 1200, salePrice: 1100, unit: 'Piece', available: false },
      { productName: 'Luminous Inverter Battery', brand: 'Luminous', variant: '150Ah', mrp: 12500, salePrice: 11800, unit: 'Piece', available: true }
    ]
  },
  {
    shopId: 'SHP-004',
    shopName: 'Shringaar Wedding Collections',
    category: 'MISC',
    subcategoryCode: 'MISC-GIFT',
    city: 'Raipur',
    area: 'Telibandha',
    contactNumber: '9876500004',
    products: [
      { productName: 'Bridal Chooda Set', brand: 'Puja Jewels', variant: '2.4 Size', mrp: 2200, salePrice: 1950, unit: 'Set', available: true },
      { productName: 'Wedding Garland', brand: 'FlowerMart', variant: 'Rose Mix 1m', mrp: 450, salePrice: 400, unit: 'Piece', available: true },
      { productName: 'Decorative Doli Cover', brand: 'Rangoli Craft', variant: 'Standard', mrp: 1800, salePrice: 1600, unit: 'Piece', available: true }
    ]
  },
  {
    shopId: 'SHP-005',
    shopName: 'GlowDecor Home Studio',
    category: 'HOME',
    subcategoryCode: 'HOME-DECOR',
    city: 'Korba',
    area: 'Transport Nagar',
    contactNumber: '9876500005',
    products: [
      { productName: 'Decorative LED Strip', brand: 'GlowFlex', variant: '5m Roll', mrp: 950, salePrice: 870, unit: 'Roll', available: true },
      { productName: 'Artificial Monstera Plant', brand: 'GreenyArt', variant: '3ft', mrp: 680, salePrice: 620, unit: 'Piece', available: true },
      { productName: 'Wall Clock Round', brand: 'Ajanta', variant: '12 inch', mrp: 380, salePrice: 340, unit: 'Piece', available: false }
    ]
  }
];

// ── Super Admin: Registered Shops ───────────────────────────────────────────

export const SA_REGISTERED_SHOPS: RegisteredShop[] = [
  {
    shopId: 'SHP-001', shopName: 'Raj Hardware Store',
    ownerName: 'Rajesh Kumar Sahu', ownerMobile: '9876500001',
    categories: ['HARD'], subcategoryCodes: ['HARD-MAT'],
    city: 'Raipur', area: 'Pandri',
    registeredOn: '2025-11-10', active: true,
    monthlyRevenue: 84000, loginCount30d: 22, lastActivity: '2026-04-18'
  },
  {
    shopId: 'SHP-002', shopName: 'SpeedZone Tyre Shop',
    ownerName: 'Vivek Chandrakar', ownerMobile: '9876500002',
    categories: ['AUTO'], subcategoryCodes: ['AUTO-BIKE'],
    city: 'Bilaspur', area: 'Torwa',
    registeredOn: '2025-12-01', active: true,
    monthlyRevenue: 61500, loginCount30d: 18, lastActivity: '2026-04-17'
  },
  {
    shopId: 'SHP-003', shopName: 'PowerCell Battery Hub',
    ownerName: 'Deepak Banjare', ownerMobile: '9876500003',
    categories: ['AUTO'], subcategoryCodes: ['AUTO-SPARE'],
    city: 'Durg', area: 'Supela',
    registeredOn: '2026-01-15', active: true,
    monthlyRevenue: 97000, loginCount30d: 31, lastActivity: '2026-04-19'
  },
  {
    shopId: 'SHP-004', shopName: 'Shringaar Wedding Collections',
    ownerName: 'Sunita Verma', ownerMobile: '9876500004',
    categories: ['MISC', 'DECO'], subcategoryCodes: ['MISC-GIFT', 'DECO-WED'],
    city: 'Raipur', area: 'Telibandha',
    registeredOn: '2026-02-20', active: true,
    monthlyRevenue: 53000, loginCount30d: 14, lastActivity: '2026-04-16'
  },
  {
    shopId: 'SHP-005', shopName: 'GlowDecor Home Studio',
    ownerName: 'Priya Dewangan', ownerMobile: '9876500005',
    categories: ['HOME', 'DECO'], subcategoryCodes: ['HOME-DECOR', 'DECO-FLOW'],
    city: 'Korba', area: 'Transport Nagar',
    registeredOn: '2026-03-05', active: false,
    monthlyRevenue: 0, loginCount30d: 2, lastActivity: '2026-03-28'
  },
  {
    shopId: 'SHP-006', shopName: 'TechPoint Mobile Store',
    ownerName: 'Amit Patel', ownerMobile: '9876500006',
    categories: ['ELEC'], subcategoryCodes: ['ELEC-MOB'],
    city: 'Raipur', area: 'Shankar Nagar',
    registeredOn: '2026-03-18', active: true,
    monthlyRevenue: 1120000, loginCount30d: 27, lastActivity: '2026-04-18'
  },
  {
    shopId: 'SHP-007', shopName: 'Noor Fabrics',
    ownerName: 'Farhan Qureshi', ownerMobile: '9876500007',
    categories: ['CLOTH', 'BEAUTY'], subcategoryCodes: ['CLOTH-MKT', 'BEAUTY-MAKEUP'],
    city: 'Bilaspur', area: 'Vyapar Vihar',
    registeredOn: '2026-04-01', active: true,
    monthlyRevenue: 42000, loginCount30d: 9, lastActivity: '2026-04-15'
  }
];

// ── Super Admin: Registered Users ───────────────────────────────────────────

export const SA_REGISTERED_USERS: RegisteredUser[] = [
  { userId: 'USR-001', name: 'Rajesh Kumar Sahu',  mobile: '9876500001', role: 'Admin',   shopId: 'SHP-001', shopName: 'Raj Hardware Store',          active: true,  lastLogin: '2026-04-18', loginCount30d: 22 },
  { userId: 'USR-002', name: 'Mohan Lal',           mobile: '9811200001', role: 'Manager', shopId: 'SHP-001', shopName: 'Raj Hardware Store',          active: true,  lastLogin: '2026-04-18', loginCount30d: 20 },
  { userId: 'USR-003', name: 'Suresh Yadav',        mobile: '9811200002', role: 'Sales',   shopId: 'SHP-001', shopName: 'Raj Hardware Store',          active: true,  lastLogin: '2026-04-17', loginCount30d: 19 },
  { userId: 'USR-004', name: 'Vivek Chandrakar',    mobile: '9876500002', role: 'Admin',   shopId: 'SHP-002', shopName: 'SpeedZone Tyre Shop',         active: true,  lastLogin: '2026-04-17', loginCount30d: 18 },
  { userId: 'USR-005', name: 'Ravi Netam',          mobile: '9811200003', role: 'Godam',   shopId: 'SHP-002', shopName: 'SpeedZone Tyre Shop',         active: true,  lastLogin: '2026-04-16', loginCount30d: 15 },
  { userId: 'USR-006', name: 'Deepak Banjare',      mobile: '9876500003', role: 'Admin',   shopId: 'SHP-003', shopName: 'PowerCell Battery Hub',       active: true,  lastLogin: '2026-04-19', loginCount30d: 31 },
  { userId: 'USR-007', name: 'Sunita Verma',        mobile: '9876500004', role: 'Admin',   shopId: 'SHP-004', shopName: 'Shringaar Wedding Collections', active: true,  lastLogin: '2026-04-16', loginCount30d: 14 },
  { userId: 'USR-008', name: 'Priya Dewangan',      mobile: '9876500005', role: 'Admin',   shopId: 'SHP-005', shopName: 'GlowDecor Home Studio',       active: false, lastLogin: '2026-03-28', loginCount30d: 2 },
  { userId: 'USR-009', name: 'Kavita Sahu',         mobile: '9811200004', role: 'Sales',   shopId: 'SHP-005', shopName: 'GlowDecor Home Studio',       active: false, lastLogin: '2026-03-25', loginCount30d: 1 },
  { userId: 'USR-010', name: 'Amit Patel',          mobile: '9876500006', role: 'Admin',   shopId: 'SHP-006', shopName: 'TechPoint Mobile Store',      active: true,  lastLogin: '2026-04-18', loginCount30d: 27 },
  { userId: 'USR-011', name: 'Farhan Qureshi',      mobile: '9876500007', role: 'Admin',   shopId: 'SHP-007', shopName: 'Noor Fabrics',                active: true,  lastLogin: '2026-04-15', loginCount30d: 9  },
  { userId: 'USR-012', name: 'Anil Thakur',         mobile: '9811200005', role: 'Sales',   shopId: 'SHP-007', shopName: 'Noor Fabrics',                active: true,  lastLogin: '2026-04-14', loginCount30d: 8  }
];
