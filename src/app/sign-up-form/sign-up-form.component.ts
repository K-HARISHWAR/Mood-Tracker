import { User } from './../services/signup.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule,Validators,FormGroup,FormBuilder } from '@angular/forms';
import { SignupService } from '../services/signup.service';
import { Router, RouterModule } from '@angular/router';
import { MoodAuthService } from '../services/moodauth.service';
@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule,RouterModule],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.css'
})
export class SignUpFormComponent {
  user: User = {
    username: '',
    password: '',
    email: ''
  };
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder,
              private signupService:SignupService,
              private router:Router,
              private moodAuthService:MoodAuthService) {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
        ]
      ],
    });
  }
  onSubmit() {
    if (this.signUpForm.valid) {
      const user = this.signUpForm.value;
      localStorage.setItem('username', user.username);
      const userData = this.signUpForm.value;
      this.signupService.signup(userData).subscribe({
      next: (res:any) => {
        this.moodAuthService.setUsername(user.username);
        console.log('User saved:', res);
        alert('Registered Successfully');
        this.signUpForm.reset(); 
      },
      error: (err:any) => {
        console.error('Error saving user:', err);
        alert('Signup failed: ' + (err.error?.reason || 'Unknown error'));
      }
    });
    } else {
      console.log('Form Invalid');
    }
  }
  gotoLogin(){
    this.router.navigate(['/login']);
  }
}
