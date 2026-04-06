import { Component } from '@angular/core';

@Component({
  selector: 'students',
  standalone: false,
  template: `
    <h1>{{ getTitle() }} - {{ getCurrentDate() }}</h1>
  `
})
export class StudentsComponent {
  title = 'Top 5 Students';

  getTitle() {
    return this.title;
  }

  getCurrentDate() {
    return new Date().toLocaleDateString();
  }
}
