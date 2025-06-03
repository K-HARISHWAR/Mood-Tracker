import { MoodAuthService } from './../services/moodauth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm:FormGroup;
  constructor(private fb: FormBuilder,
              private router:Router ,
              private authService:AuthService,
              private moodAuthService:MoodAuthService){
      this.loginForm = this.fb.group({
          username: ['', Validators.required],
          password: ['', [Validators.required, Validators.minLength(6)]]
        });       
  }
  error: string='';
   login() {
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe(
      success => {
        if (success) {
          const username = this.loginForm.value.username;
          localStorage.setItem('username', username);
          this.router.navigate(['/home']);
        } else {
          this.error = 'Invalid username or password';
        }
      },
      err => {
        this.error = 'Login failed. Please try again.';
      }
    );
  }
  gotoSignUp(){
    this.router.navigate(['/']);
  }
  
}
