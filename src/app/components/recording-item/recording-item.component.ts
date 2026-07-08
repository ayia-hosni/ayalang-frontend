import { Component, input, output } from '@angular/core';
import { LucideTrash2, LucidePlay } from '@lucide/angular';
import { Recording } from '../../models/question.model';

@Component({
  selector: 'app-recording-item',
  standalone: true,
  imports: [LucideTrash2, LucidePlay],
  templateUrl: './recording-item.component.html',
})
export class RecordingItemComponent {
  recording = input.required<Recording>();
  index = input.required<number>();
  deleted = output<void>();

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  formatTimestamp(ts: string): string {
    return new Date(ts).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}
