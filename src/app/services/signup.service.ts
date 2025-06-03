import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface User{
  username:string;
  password:string;
  email:string;
}
@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private couchdbUrl='http://localhost:5984/moodtracker';
  private username: string='Harishwar';
  private password: string='harish22';
  constructor(private http:HttpClient) {}
  
  signup(user:User): Observable<any>{
    const userDoc={
      _id:user.username,
      username:user.username,
      password:user.password,
      email:user.email,
      type:'user'
    };
    const headers=new HttpHeaders({
      'Content-Type':'application/json',
      Authorization:
        'Basic ' + btoa(`${this.username}:${this.password}`),
    });
    return this.http.put(`${this.couchdbUrl}/${user.username}`, userDoc, { headers });
  }
}
