import { Component, computed, input, output, signal } from '@angular/core';
import { LucideStar, LucideChevronRight } from '@lucide/angular';
import { QuestionsApiService } from '../../services/questions-api.service';
import { Category, Question } from '../../models/question.model';

const TRACK_ORDER = ['Frontend', 'Backend', 'DevOps', 'Mobile', 'This App'];
const DIFFICULTY_ORDER = ['Junior', 'Mid', 'Senior'];

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [LucideStar, LucideChevronRight],
  templateUrl: './home-view.component.html',
})
export class HomeViewComponent {
  totalXP = input.required<number>();
  selectQuestion = output<Question>();

  categories = signal<Category[]>([]);
  questions = signal<Question[]>([]);
  activeCategoryId = signal<string | null>(null);
  activeDifficulty = signal<string | null>(null);
  activeTrack = signal<string | null>(null);
  activeStack = signal<string | null>(null);
  loading = signal(true);

  questionsInCategory = computed(() =>
    this.questions().filter((q) => q.category.id === this.activeCategoryId())
  );

  availableDifficulties = computed(() => {
    const difficulties = new Set(
      this.questionsInCategory()
        .map((q) => q.difficulty)
        .filter((difficulty): difficulty is string => !!difficulty),
    );
    return DIFFICULTY_ORDER.filter((difficulty) => difficulties.has(difficulty));
  });

  questionsInDifficulty = computed(() => {
    const difficulty = this.activeDifficulty();
    return this.questionsInCategory().filter(
      (q) => !difficulty || q.difficulty === difficulty,
    );
  });

  availableTracks = computed(() => {
    const tracks = new Set(
      this.questionsInDifficulty()
        .map((q) => q.track)
        .filter((track): track is string => !!track),
    );
    return TRACK_ORDER.filter((track) => tracks.has(track));
  });

  questionsInTrack = computed(() => {
    const track = this.activeTrack();
    return this.questionsInDifficulty().filter((q) => !track || q.track === track);
  });

  availableStacks = computed(() =>
    [
      ...new Set(
        this.questionsInTrack()
          .map((q) => q.stack)
          .filter((stack): stack is string => !!stack),
      ),
    ].sort(),
  );

  visibleQuestions = computed(() => {
    const stack = this.activeStack();
    return this.questionsInTrack().filter((q) => !stack || q.stack === stack);
  });

  constructor(private questionsApi: QuestionsApiService) {
    this.questionsApi.getCategories().subscribe((categories) => {
      this.categories.set(categories);
      if (categories.length) this.activeCategoryId.set(categories[0].id);
    });
    this.questionsApi.getQuestions().subscribe({
      next: (questions) => {
        this.questions.set(questions);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  selectCategory(id: string) {
    this.activeCategoryId.set(id);
    this.activeDifficulty.set(null);
    this.activeTrack.set(null);
    this.activeStack.set(null);
  }

  selectDifficulty(difficulty: string | null) {
    this.activeDifficulty.set(difficulty);
    this.activeTrack.set(null);
    this.activeStack.set(null);
  }

  selectTrack(track: string | null) {
    this.activeTrack.set(track);
    this.activeStack.set(null);
  }

  selectStack(stack: string | null) {
    this.activeStack.set(stack);
  }

  choose(question: Question) {
    this.selectQuestion.emit(question);
  }
}
