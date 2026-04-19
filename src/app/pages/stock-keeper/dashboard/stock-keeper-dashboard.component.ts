import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-stock-keeper-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-keeper-dashboard.component.html',
  styleUrl: './stock-keeper-dashboard.component.scss'
})
export class StockKeeperDashboardComponent {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly activeTab = signal<'overview' | 'stock' | 'intake'>('overview');

  readonly totalLocations = computed(() => 24);
  readonly occupiedCells = computed(() => 18);
  readonly emptySpaces = computed(() => 6);
  readonly pendingIntakes = computed(() => 3);

  readonly stockLocations = signal([
    { id: 'LOC-001', rack: 'R1', shelf: 'S2', cell: 'C3', status: 'Occupied', items: 8 },
    { id: 'LOC-002', rack: 'R1', shelf: 'S3', cell: 'C1', status: 'Occupied', items: 5 },
    { id: 'LOC-003', rack: 'R2', shelf: 'S1', cell: 'C2', status: 'Occupied', items: 12 },
    { id: 'LOC-004', rack: 'R2', shelf: 'S2', cell: 'C4', status: 'Empty', items: 0 }
  ]);

  logout(): void {
    this.authService.logout();
  }

  setTab(tab: 'overview' | 'stock' | 'intake'): void {
    this.activeTab.set(tab);
  }
}
