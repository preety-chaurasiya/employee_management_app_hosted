import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './project-employees.html',
  styleUrls: ['./project-employees.css']
})
export class ProjectEmployeeComponent implements OnInit {

  projectEmployees: any[] = [];

  formData = {
    empProjectId: '',
    projectId: '',
    employeeId: '',
    assignedDate: '',
    role: ''
  };

  apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  // Load all project employee records
  loadData() {
    this.http.get(`${this.apiUrl}/projectEmployee`).subscribe({
      next: (res: any) => {
        this.projectEmployees = Array.isArray(res) ? res : [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading project employees', err)
    });
  }

  // Submit form (Add or Update)
  submitForm(f: NgForm) {
    if (!f.valid) {
      alert('Please fill all fields');
      return;
    }

    // Auto-generate empProjectId for new records
    if (!this.formData.empProjectId) {
      this.formData.empProjectId = 'EP' + Date.now();
    }

    const exists = this.projectEmployees.find(p => p.empProjectId === this.formData.empProjectId);

    if (exists) {
      // Update existing record
      this.http.put(`${this.apiUrl}/projectEmployee/${this.formData.empProjectId}`, this.formData)
        .subscribe({
          next: () => {
            alert('Updated successfully');
            this.resetForm();
            this.loadData();
          },
          error: (err) => console.error('Error updating record:', err)
        });
    } else {
      // Add new record
      this.http.post(`${this.apiUrl}/projectEmployee`, this.formData)
        .subscribe({
          next: () => {
            alert('Added successfully');
            this.resetForm();
            this.loadData();
          },
          error: (err) => console.error('Error adding record:', err)
        });
    }
  }

  // Edit record (fill form)
  edit(empProjectId: string) {
    const record = this.projectEmployees.find(p => p.empProjectId === empProjectId);
    if (record) this.formData = { ...record };
  }

  // Delete record
  delete(empProjectId: string) {
    if (!confirm('Are you sure?')) return;
    this.http.delete(`${this.apiUrl}/projectEmployee/${empProjectId}`).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error('Error deleting record:', err)
    });
  }

  // Reset form
  resetForm() {
    this.formData = { empProjectId: '', projectId: '', employeeId: '', assignedDate: '', role: '' };
  }
}
