import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-view',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './employee-view.html',
  styleUrl: './employee-view.css'
})
export class EmployeeView implements OnInit {
  employee: any = null;
  loading = true;
  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.employeeService.getEmployeeById(id).subscribe({
      next: (emp) => {
        this.employee = emp;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
