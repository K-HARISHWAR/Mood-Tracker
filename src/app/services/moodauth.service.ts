import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoodAuthService {
  private readonly USER_KEY = 'username';

  setUsername(username: string): void {
    localStorage.setItem(this.USER_KEY, username);
    console.log('[AuthService] Username stored:', username);
  }

  getUsername(): string {
    const username = localStorage.getItem(this.USER_KEY);
    if (!username) {
      console.warn('[AuthService] No username found in localStorage');
      return 'unknown_user';
    }
    return username;
  }

  clear(): void {
    localStorage.removeItem(this.USER_KEY);
  }
}
