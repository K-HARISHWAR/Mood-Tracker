import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject: BehaviorSubject<boolean>;
  darkMode$: Observable<boolean>;

  constructor() {
    const storedValue = localStorage.getItem('darkMode');
    const initialValue = storedValue === 'true'; 
    this.darkModeSubject = new BehaviorSubject<boolean>(initialValue);
    this.darkMode$ = this.darkModeSubject.asObservable();
  }

  toggleDarkMode() {
    const newValue = !this.darkModeSubject.value;
    this.darkModeSubject.next(newValue);
    localStorage.setItem('darkMode', String(newValue));
  }

  setDarkMode(state: boolean) {
    this.darkModeSubject.next(state);
    localStorage.setItem('darkMode', String(state));
  }

  get isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}
