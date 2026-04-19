# File Structure & Libraries Guide

## ✨ New File Structure (Organized by Role)

```
src/app/pages/
├── login/
│   ├── login.component.ts
│   ├── login.component.html
│   └── login.component.scss
├── superadmin/
│   ├── dashboard/
│   │   ├── superadmin-dashboard.component.ts
│   │   ├── superadmin-dashboard.component.html
│   │   └── superadmin-dashboard.component.scss
│   └── shop-registration/
│       └── [future: shop registration form]
├── admin/
│   └── dashboard/
│       └── admin-dashboard.component.ts
├── manager/
│   └── dashboard/
│       └── manager-dashboard.component.ts
├── sales/
│   └── dashboard/
│       └── sales-dashboard.component.ts
└── godam/
    └── dashboard/
        └── godam-dashboard.component.ts
```

## 📊 Libraries Added

### 1. **Chart.js** + **ng2-charts**
   - **What**: Industry-standard charting library
   - **Free**: Yes (MIT License)
   - **Why**: No dependencies, widely supported, 10+ chart types (Line, Bar, Pie, Doughnut, Radar, etc.)
   - **Usage**:
     ```typescript
     import { NgChartsModule } from 'ng2-charts';
     import { Chart } from 'chart.js';
     
     @Component({
       imports: [NgChartsModule]
     })
     export class MyComponent {
       chartData = { labels: [...], datasets: [...] };
       chartOptions = { responsive: true, maintainAspectRatio: false };
     }
     ```
   - **Docs**: https://www.chartjs.org/

### 2. **Tabler Icons** (@tabler/icons)
   - **What**: 5000+ free SVG icons (professional, consistent design)
   - **Free**: Yes (MIT License)
   - **Why**: Comprehensive, simple, consistent, lightweight (~1MB for all)
   - **Included Icons**: Shopping, charts, users, settings, home, etc.
   - **How to Use**: Copy SVG inline or use as React/Vue/Angular components

   **Quick Usage:**
   ```html
   <!-- Include from CDN or copy SVG -->
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
     <path d="M12 2L15.09 8.26h6.79L17.35 12.74h2.74L12 17.64l-8.09-4.9h2.74L2.12 8.26h6.79L12 2z" />
   </svg>
   ```

   **Or use npm package:**
   ```bash
   npm install @tabler/icons
   ```
   Then import SVG files from `node_modules/@tabler/icons/tabler-icons/` and use in templates.

## 🎨 Icon Examples (Currently Using Unicode Emojis)

The app currently uses Unicode emojis which work great:
- 📊 Charts/Analytics
- 🏪 Shops
- 👥 Users
- 💰 Revenue
- 📱 Mobile/Activity
- ➕ Add/Create
- ✓ Check/Active
- ✗ Inactive

**To upgrade to Tabler Icons:**
1. Download SVG files from `/node_modules/@tabler/icons/tabler-icons/`
2. Replace emoji with `<svg>` tags or create an icon component:

```typescript
// icon.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: '<svg [attr.data-icon]="name" class="icon"></svg>'
})
export class IconComponent {
  @Input() name: string = 'home';
}
```

## 📦 Package.json Dependencies

```json
{
  "chart.js": "^4.x",
  "ng2-charts": "^4.x",
  "@tabler/icons": "^2.x"
}
```

## 🚀 Building & Running

```bash
# Install dependencies
npm install

# Development server
npm start

# Build for production
npm run build
```

## 📝 Component Locations

| Role | Component Path | Status |
|------|---|---|
| **SuperAdmin** | `pages/superadmin/dashboard/` | ✅ Complete |
| **Admin** | `pages/admin/dashboard/` | 🔄 Placeholder |
| **Manager** | `pages/manager/dashboard/` | 🔄 Placeholder |
| **Sales** | `pages/sales/dashboard/` | 🔄 Placeholder |
| **Godam** | `pages/godam/dashboard/` | 🔄 Placeholder |
| **Login** | `pages/login/` | ✅ Complete |

## 💡 Chart Integration Example

```typescript
import { Component } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-revenue-chart',
  imports: [NgChartsModule],
  template: `<div><canvas baseChart [data]="chartData" [options]="chartOptions"></canvas></div>`
})
export class RevenueChartComponent {
  chartData: ChartConfiguration['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Revenue (₹)',
      data: [12000, 19000, 15000, 25000, 22000],
      backgroundColor: 'var(--accent)'
    }]
  };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };
}
```

---

**Next Steps:**
1. ✅ File structure organized by role
2. ✅ Chart & icon libraries added
3. 🔄 Build role-specific dashboards (Admin, Manager, Sales, Godam)
4. 🔄 Add chart visualizations to dashboards
5. 🔄 Integrate Tabler Icons across UI
