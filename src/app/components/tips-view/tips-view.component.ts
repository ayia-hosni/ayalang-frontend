import { Component } from '@angular/core';
import { LucideLightbulb } from '@lucide/angular';

interface TipGroup {
  title: string;
  color: string;
  tips: string[];
}

@Component({
  selector: 'app-tips-view',
  standalone: true,
  imports: [LucideLightbulb],
  templateUrl: './tips-view.component.html',
})
export class TipsViewComponent {
  groups: TipGroup[] = [
    {
      title: 'Before you answer',
      color: 'bg-blue-50 text-blue-500',
      tips: [
        'Restate the question in your own words to buy thinking time.',
        'Break big questions into smaller parts before diving in.',
        'It is fine to pause for a couple of seconds to structure your answer.',
      ],
    },
    {
      title: 'While answering',
      color: 'bg-pink-50 text-pink-500',
      tips: [
        'Use STAR for behavioral questions: Situation, Task, Action, Result.',
        'Narrate your thinking out loud for technical questions.',
        'Keep answers to 60-90 seconds unless asked to go deeper.',
      ],
    },
    {
      title: 'After you answer',
      color: 'bg-yellow-50 text-yellow-500',
      tips: [
        'Listen back to your recordings and note filler words.',
        'Ask yourself: did I actually answer the question that was asked?',
        'Practice the same question again focusing on your weakest sub-part.',
      ],
    },
  ];
}
