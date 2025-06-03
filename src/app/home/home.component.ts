import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { MoodService } from '../services/mood.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isDarkMode = false;
  username: string = '';
  greeting: string = '';
  activeTab: 'form' | 'list' = 'form';

  // Stats
  streakCount: number = 0;
  totalEntries: number = 0;
  mostFrequentMood: string = '';

  recentMoods: { mood: string; note: string; date: string }[] = [];

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private moodService: MoodService
  ) {
    this.themeService.darkMode$.subscribe(mode => (this.isDarkMode = mode));
  }

  ngOnInit(): void {
    this.setGreeting();
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      this.loadStreak();
      this.loadStats();
      this.loadRecentMoods();
    }
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToMoodForm(): void {
    this.router.navigate(['/mood-form']);
  }

  goToMoodChart(): void {
    this.router.navigate(['/mood-chart']);
  }

  setTab(tab: 'form' | 'list'): void {
    this.activeTab = tab;
  }

  setGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour < 18) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  loadStreak(): void {
    this.moodService.getUserMoodDates(this.username).subscribe(dates => {
      this.streakCount = this.getCurrentStreak(dates);
    });
  }

  getCurrentStreak(dates: string[]): number {
    const dateSet = new Set(dates);
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 100; i++) {
      const checkDate = new Date();
      checkDate.setDate(today.getDate() - i);
      const formatted = checkDate.toISOString().slice(0, 10);
      if (dateSet.has(formatted)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  loadStats(): void {
    this.moodService.getUserMoodStats(this.username).subscribe(stats => {
      this.totalEntries = stats.total || 0;
      this.mostFrequentMood = stats.frequentMood || 'N/A';
    });
  }

  loadRecentMoods(): void {
     this.moodService.getRecentMoods(this.username).subscribe({
    next: (moods) => {
      console.log('Recent moods:', moods);
      this.recentMoods = moods.slice(0, 3);
      console.log('recentMoods in component:', this.recentMoods);

    },
    error: (err) => console.error('Error loading recent moods:', err)
  });
  }
}
