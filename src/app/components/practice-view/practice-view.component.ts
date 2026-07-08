import { Component, OnDestroy, computed, effect, input, output, signal } from '@angular/core';
import {
  LucideChevronLeft,
  LucideClock,
  LucideMic,
  LucideSquare,
  LucideLightbulb,
  LucideListTree,
} from '@lucide/angular';
import { Question, Recording } from '../../models/question.model';
import { RecordingItemComponent } from '../recording-item/recording-item.component';
import { RecordingsApiService } from '../../services/recordings-api.service';

@Component({
  selector: 'app-practice-view',
  standalone: true,
  imports: [
    LucideChevronLeft,
    LucideClock,
    LucideMic,
    LucideSquare,
    LucideLightbulb,
    LucideListTree,
    RecordingItemComponent,
  ],
  templateUrl: './practice-view.component.html',
})
export class PracticeViewComponent implements OnDestroy {
  question = input.required<Question>();

  back = output<void>();
  xpEarned = output<number>();

  activeSubQuestionId = signal<string | null>(null);
  showBreakdown = signal(false);
  showHints = signal(false);

  isRecording = signal(false);
  recordingTime = signal(0);
  loadingRecordings = signal(true);
  isUploading = signal(false);
  saveError = signal<string | null>(null);

  private allRecordings = signal<Recording[]>([]);

  private mediaRecorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];
  private timerId: ReturnType<typeof setInterval> | null = null;

  activeSubQuestion = computed(() => {
    const id = this.activeSubQuestionId();
    if (!id) return null;
    return this.question().subQuestions.find((s) => s.id === id) ?? null;
  });

  currentPromptText = computed(() => this.activeSubQuestion()?.text ?? this.question().text);

  currentRecordings = computed(() =>
    this.allRecordings().filter((r) => r.subQuestionId === this.activeSubQuestionId()),
  );

  constructor(private recordingsApi: RecordingsApiService) {
    effect(() => {
      const questionId = this.question().id;
      this.loadingRecordings.set(true);
      this.recordingsApi.list(questionId).subscribe({
        next: (recordings) => {
          this.allRecordings.set(recordings);
          this.loadingRecordings.set(false);
        },
        error: () => this.loadingRecordings.set(false),
      });
    });
  }

  selectPart(id: string | null) {
    if (this.isRecording()) return;
    this.activeSubQuestionId.set(id);
  }

  toggleBreakdown() {
    this.showBreakdown.update((v) => !v);
  }

  toggleHints() {
    this.showHints.update((v) => !v);
  }

  formatTime(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  async startRecording() {
    if (this.isRecording()) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.chunks = [];
      const recorder = new MediaRecorder(stream);
      this.mediaRecorder = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.chunks.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        const duration = this.recordingTime();
        const subQuestionId = this.activeSubQuestionId();
        this.isUploading.set(true);
        this.saveError.set(null);
        this.recordingsApi.create(this.question().id, subQuestionId, duration, blob).subscribe({
          next: (saved) => {
            this.allRecordings.update((list) => [{ ...saved, subQuestionId }, ...list]);
            this.xpEarned.emit(saved.totalXP);
            this.isUploading.set(false);
          },
          error: (err) => {
            console.error('Failed to save recording:', err);
            this.saveError.set('Could not save this recording. Please try again.');
            this.isUploading.set(false);
          },
        });
      };

      recorder.start();
      this.isRecording.set(true);
      this.recordingTime.set(0);
      this.timerId = setInterval(() => this.recordingTime.update((t) => t + 1), 1000);
    } catch (err) {
      console.error('Could not start recording:', err);
    }
  }

  stopRecording() {
    if (!this.isRecording()) return;
    this.mediaRecorder?.stop();
    this.isRecording.set(false);
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  removeRecording(id: string) {
    this.recordingsApi.delete(id).subscribe(() => {
      this.allRecordings.update((list) => list.filter((r) => r.id !== id));
    });
  }

  ngOnDestroy(): void {
    if (this.timerId !== null) clearInterval(this.timerId);
    this.mediaRecorder?.stream?.getTracks().forEach((t) => t.stop());
  }
}
