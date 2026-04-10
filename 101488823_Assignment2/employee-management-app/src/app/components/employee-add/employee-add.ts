import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-add',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-add.html',
  styleUrl: './employee-add.css'
})
export class EmployeeAdd {
  employeeForm: FormGroup;
  errorMessage = '';
  loading = false;
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
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

    this.loading = true;
    this.errorMessage = '';
    const formValue = { ...this.employeeForm.value };
    formValue.salary = parseFloat(formValue.salary);

    this.employeeService.addEmployee(formValue).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Failed to add employee.';
      }
    });
  }
}
