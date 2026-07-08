import { Component } from '@angular/core';
import { LucideTrophy } from '@lucide/angular';

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  avatarSeed: string;
}

@Component({
  selector: 'app-leaderboard-view',
  standalone: true,
  imports: [LucideTrophy],
  templateUrl: './leaderboard-view.component.html',
})
export class LeaderboardViewComponent {
  entries: LeaderboardEntry[] = [
    { rank: 1, name: 'Jordan Lee', xp: 2140, avatarSeed: 'Jordan' },
    { rank: 2, name: 'Sam Rivera', xp: 1875, avatarSeed: 'Sam' },
    { rank: 3, name: 'Alex Candidate (You)', xp: 1250, avatarSeed: 'Felix' },
    { rank: 4, name: 'Taylor Kim', xp: 980, avatarSeed: 'Taylor' },
  ];
}
