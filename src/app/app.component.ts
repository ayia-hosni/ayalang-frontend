import { Component, signal } from '@angular/core';
import { TopNavComponent, TabId } from './components/top-nav/top-nav.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { HomeViewComponent } from './components/home-view/home-view.component';
import { PracticeViewComponent } from './components/practice-view/practice-view.component';
import { ProfileViewComponent } from './components/profile-view/profile-view.component';
import { TipsViewComponent } from './components/tips-view/tips-view.component';
import { LeaderboardViewComponent } from './components/leaderboard-view/leaderboard-view.component';
import { AuthViewComponent } from './components/auth-view/auth-view.component';
import { Question } from './models/question.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TopNavComponent,
    BottomNavComponent,
    HomeViewComponent,
    PracticeViewComponent,
    ProfileViewComponent,
    TipsViewComponent,
    LeaderboardViewComponent,
    AuthViewComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  activeTab = signal<TabId>('home');
  selectedQuestion = signal<Question | null>(null);

  constructor(public auth: AuthService) {}

  setTab(tab: TabId) {
    this.activeTab.set(tab);
  }

  navigateToQuestion(question: Question) {
    this.selectedQuestion.set(question);
    this.activeTab.set('practice');
  }

  navigateHome() {
    this.activeTab.set('home');
    this.selectedQuestion.set(null);
  }

  onXPEarned(totalXP: number) {
    this.auth.setXP(totalXP);
  }

  onLogout() {
    this.auth.logout();
    this.navigateHome();
  }
}
