import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMsg: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private auth: AuthService       // 👈 inject AuthService
  ) {}

  async login(form: NgForm) {

    if (!form.valid) {
      this.errorMsg = 'Enter valid email and password!';
      return;
    }

    try {
      const res: any = await this.http
        .post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password
        })
        .toPromise();

      // 👉 IMPORTANT: set login state here
      this.auth.setLoginState(true);

      console.log("User logged in, navigating...");
      this.router.navigate(['/layout/dashboard']);

    } catch (error: any) {
      this.errorMsg = 'Login failed. Check email/password.';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
