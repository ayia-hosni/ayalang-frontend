import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Recording } from '../models/question.model';

export interface CreateRecordingResponse extends Recording {
  totalXP: number;
}

@Injectable({ providedIn: 'root' })
export class RecordingsApiService {
  constructor(private http: HttpClient) {}

  list(questionId: string) {
    return this.http.get<Recording[]>(`${environment.apiUrl}/recordings`, {
      params: { questionId },
    });
  }

  create(
    questionId: string,
    subQuestionId: string | null,
    duration: number,
    audio: Blob,
  ) {
    const form = new FormData();
    form.append('questionId', questionId);
    if (subQuestionId) form.append('subQuestionId', subQuestionId);
    form.append('duration', String(duration));
    form.append('audio', audio, 'recording.webm');
    return this.http.post<CreateRecordingResponse>(`${environment.apiUrl}/recordings`, form);
  }

  delete(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/recordings/${id}`);
  }

  stats() {
    return this.http.get<{ totalCount: number }>(`${environment.apiUrl}/recordings/stats`);
  }
}
