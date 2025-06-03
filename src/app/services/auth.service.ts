import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private couchdbUrl = 'http://localhost:5984/moodtracker';
  constructor(private http:HttpClient){}
  login(username: string, password: string) {
    const url = `${this.couchdbUrl}/${username}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('Harishwar:harish22')
    });
    return this.http.get<any>(url, { headers }).pipe(
    map(doc => {
      if (doc.password === password) {
        return true;
      } else {
        alert('Incorrect password');
        return false;
      }
    }),
    catchError(err => {
      alert('Invalid username');
      return of(false);
    })
  );
}
}
