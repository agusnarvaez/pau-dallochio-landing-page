import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-faq-item',
  imports: [CommonModule],
  templateUrl: './faq-item.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './faq-item.component.css',
})
export class FaqItemComponent {
  @Input() question: string
  @Input() answer: string
  constructor() {
    this.question = ''
    this.answer = ''
  }
  showAnswer = false
  toggleAnswer() {
    this.showAnswer = !this.showAnswer
  }
}
