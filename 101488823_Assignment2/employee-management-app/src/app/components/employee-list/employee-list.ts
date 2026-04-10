import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList implements OnInit {
  employees: any[] = [];
  loading = true;
  searchDepartment = '';
  searchDesignation = '';
  errorMessage = '';

  constructor(private employeeService: EmployeeService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.errorMessage = '';
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
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

  searchEmployees() {
    if (!this.searchDepartment && !this.searchDesignation) {
      this.loadEmployees();
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.employeeService.searchEmployees(
      this.searchDesignation || undefined,
      this.searchDepartment || undefined
    ).subscribe({
      next: (data) => {
        this.employees = data;
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

  clearSearch() {
    this.searchDepartment = '';
    this.searchDesignation = '';
    this.loadEmployees();
  }

  viewEmployee(id: string) {
    this.router.navigate(['/employees/view', id]);
  }

  editEmployee(id: string) {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => this.loadEmployees(),
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
}
