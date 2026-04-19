import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SuperAdminDashboardComponent } from './pages/superadmin/dashboard/superadmin-dashboard.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { ShopManagerDashboardComponent } from './pages/shop-manager/dashboard/shop-manager-dashboard.component';
import { SalesExecutiveDashboardComponent } from './pages/sales-executive/dashboard/sales-executive-dashboard.component';
import { ProductManagerDashboardComponent } from './pages/product-manager/dashboard/product-manager-dashboard.component';
import { StockKeeperDashboardComponent } from './pages/stock-keeper/dashboard/stock-keeper-dashboard.component';
import { authGuard, roleGuard } from './guards/role.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },

	// Role-based dashboard routes
	{
		path: 'dashboard/superadmin',
		component: SuperAdminDashboardComponent,
		canActivate: [authGuard(), roleGuard(['SuperAdmin'])]
	},
	{
		path: 'dashboard/admin',
		component: AdminDashboardComponent,
		canActivate: [authGuard(), roleGuard(['Admin'])]
	},
	{
		path: 'dashboard/shop-manager',
		component: ShopManagerDashboardComponent,
		canActivate: [authGuard(), roleGuard(['Manager'])]
	},
	{
		path: 'dashboard/sales-executive',
		component: SalesExecutiveDashboardComponent,
		canActivate: [authGuard(), roleGuard(['Sales'])]
	},
	{
		path: 'dashboard/product-manager',
		component: ProductManagerDashboardComponent,
		canActivate: [authGuard(), roleGuard(['ProductManager'])]
	},
	{
		path: 'dashboard/stock-keeper',
		component: StockKeeperDashboardComponent,
		canActivate: [authGuard(), roleGuard(['Godam'])]
	},

	// Backward compatibility
	{ path: 'dashboard', redirectTo: 'dashboard/superadmin', pathMatch: 'full' },

	{ path: '**', redirectTo: 'login' }
];
