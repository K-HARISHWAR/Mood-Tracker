import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
   private darkModeSubject = new BehaviorSubject<boolean>(false);
    darkMode$ = this.darkModeSubject.asObservable();

  toggleDarkMode() {
   this.darkModeSubject.next(!this.darkModeSubject.value);
  }

  setDarkMode(state: boolean) {
    this.darkModeSubject.next(state);
  }

  get isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}
