import { Component, input, output } from '@angular/core';
import { LucideHome, LucideTrophy, LucideUser, LucideLightbulb } from '@lucide/angular';
import { TabId } from '../top-nav/top-nav.component';

interface NavItem {
  id: TabId;
  label: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [LucideHome, LucideTrophy, LucideUser, LucideLightbulb],
  templateUrl: './bottom-nav.component.html',
})
export class BottomNavComponent {
  activeTab = input.required<TabId>();
  tabChange = output<TabId>();

  navItems: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'tips', label: 'Tips' },
    { id: 'leaderboard', label: 'Rank' },
    { id: 'profile', label: 'Profile' },
  ];

  isActive(id: TabId): boolean {
    const active = this.activeTab();
    return active === id || (id === 'home' && active === 'practice');
  }

  select(id: TabId) {
    this.tabChange.emit(id);
  }
}
