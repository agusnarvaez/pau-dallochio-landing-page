import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FaqItemComponent } from '../../../components/faq-item/faq-item.component'

@Component({
  selector: 'app-home-faq',
  standalone: true,
  imports: [CommonModule,FaqItemComponent],
  templateUrl: './home-faq.component.html',
  styleUrl: './home-faq.component.css'
})
export class HomeFaqComponent {
  constructor() {}
  faqList = [
    {
      question: 'What is the best way to get started?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatem.'
    },
    {
      question: 'What is the best way to get started?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatem.'
    },
    {
      question: 'What is the best way to get started?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatem.'
    },
    {
      question: 'What is the best way to get started?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatem.'
    },
    {
      question: 'What is the best way to get started?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatem.'
    },
    {
      question: 'What is the best way to get started?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatem.'
    }
  ]

}
