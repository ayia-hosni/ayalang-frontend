import { Component, input, output, signal } from '@angular/core';
import { LucideStar, LucideFlame, LucideTrophy, LucideLogOut } from '@lucide/angular';
import { RecordingsApiService } from '../../services/recordings-api.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [LucideStar, LucideFlame, LucideTrophy, LucideLogOut],
  templateUrl: './profile-view.component.html',
})
export class ProfileViewComponent {
  totalXP = input.required<number>();
  displayName = input<string>('Alex Candidate');
  logout = output<void>();

  totalPracticed = signal(0);

  achievements = [
    { icon: '🎙️', name: 'First Take' },
    { icon: '🔥', name: '3 Day Streak' },
    { icon: '🧠', name: 'Behavioral Pro' },
    { icon: '⭐', name: '1000 XP Club' },
  ];

  constructor(recordingsApi: RecordingsApiService) {
    recordingsApi.stats().subscribe((stats) => this.totalPracticed.set(stats.totalCount));
  }
}
