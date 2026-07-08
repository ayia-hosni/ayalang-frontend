import { Component, input, output } from '@angular/core';
import { LucideHome, LucideTrophy, LucideUser, LucideLightbulb, LucideMic } from '@lucide/angular';

export type TabId = 'home' | 'practice' | 'tips' | 'leaderboard' | 'profile';

interface NavItem {
  id: TabId;
  label: string;
}

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [LucideHome, LucideTrophy, LucideUser, LucideLightbulb, LucideMic],
  templateUrl: './top-nav.component.html',
})
export class TopNavComponent {
  activeTab = input.required<TabId>();
  tabChange = output<TabId>();

  navItems: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'tips', label: 'Tips' },
    { id: 'leaderboard', label: 'Leaderboard' },
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
