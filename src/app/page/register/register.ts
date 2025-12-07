import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  email = '';
  password = '';
  confirmPassword = '';
  errorMsg = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  register(form: NgForm) {

    if (!form.valid) {
      this.errorMsg = "Please fill all fields correctly!";
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMsg = "Passwords do not match!";
      return;
    }

    const body = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/api/register', body)
      .subscribe({
        next: res => {
          alert("Registration Successful!");
          this.router.navigate(['/login']);
        },
        error: err => {
          console.error(err);
          this.errorMsg = "Registration failed. Try again.";
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
