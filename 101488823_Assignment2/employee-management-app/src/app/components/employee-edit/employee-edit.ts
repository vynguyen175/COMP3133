import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-edit.html',
  styleUrl: './employee-edit.css'
})
export class EmployeeEdit implements OnInit {
  employeeForm: FormGroup;
  errorMessage = '';
  loading = false;
  saving = false;
  employeeId = '';
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['Male'],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      employee_photo: ['']
    });
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.params['id'];
    this.loadEmployee();
  }

  loadEmployee() {
    this.loading = true;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (emp) => {
        const dateStr = emp.date_of_joining
          ? new Date(parseInt(emp.date_of_joining) || emp.date_of_joining).toISOString().split('T')[0]
          : '';
        this.employeeForm.patchValue({
          first_name: emp.first_name,
          last_name: emp.last_name,
          email: emp.email,
          gender: emp.gender || 'Male',
          designation: emp.designation,
          salary: emp.salary,
          date_of_joining: dateStr,
          department: emp.department
        });
        this.photoPreview = emp.employee_photo;
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

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 200;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxSize) { height *= maxSize / width; width = maxSize; }
        } else {
          if (height > maxSize) { width *= maxSize / height; height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        this.photoPreview = compressed;
        this.employeeForm.patchValue({ employee_photo: compressed });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.employeeForm.invalid) return;

    this.saving = true;
    this.errorMessage = '';
    const formValue = { ...this.employeeForm.value };
    formValue.salary = parseFloat(formValue.salary);

    this.employeeService.updateEmployee(this.employeeId, formValue).subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.message || 'Failed to update employee.';
        this.cdr.detectChanges();
      }
    });
  }
}
