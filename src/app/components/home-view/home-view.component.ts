import { Component, computed, input, output, signal } from '@angular/core';
import { LucideStar, LucideChevronRight } from '@lucide/angular';
import { QuestionsApiService } from '../../services/questions-api.service';
import { Category, Question } from '../../models/question.model';

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
  loading = signal(true);

  visibleQuestions = computed(() =>
    this.questions().filter((q) => q.category.id === this.activeCategoryId())
  );

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
  }

  choose(question: Question) {
    this.selectQuestion.emit(question);
  }
}
