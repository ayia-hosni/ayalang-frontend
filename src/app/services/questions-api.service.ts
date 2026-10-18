import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category, ExampleAnswer, Question } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionsApiService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }

  getQuestions(categoryId?: string) {
    return this.http.get<Question[]>(`${environment.apiUrl}/questions`, {
      params: categoryId ? { categoryId } : {},
    });
  }

  getExampleAnswer(questionId: string, exclude?: string) {
    return this.http.get<ExampleAnswer>(
      `${environment.apiUrl}/questions/${questionId}/example-answer`,
      { params: exclude ? { exclude } : {} },
    );
  }
}
