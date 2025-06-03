import PouchDB from 'pouchdb-browser';
import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartDataset, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { ThemeService } from '../services/theme.service';
import { Router } from '@angular/router';

interface MoodEntry {
  _id: string;
  _rev: string;
  date: string;
  mood: string;
  moodScore: number;
  note?: string;
  userId: string;
}

@Component({
  selector: 'app-mood-chart',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './mood-chart.component.html',
  styleUrls: ['./mood-chart.component.css']
})
export class MoodChartComponent implements OnInit {
  db: PouchDB.Database<MoodEntry>;
  @Input() isDarkMode=false;
  filterRange: '7d' | '30d' = '7d';

  averageMood: number = 0;

  barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Daily Mood Comparison',
      }
    },
    scales: {
      y: {
        beginAtZero:true,
        min: 0,
        max: 5,
        title: {
          display: true,
          text: 'Mood (1-5)'
        }
      },
      x: {}
    }
  };

  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartData: {
    labels: string[];
    datasets: ChartDataset<'bar', number[]>[];
  } = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Mood',
        backgroundColor: []
      }
    ]
  };


  constructor(private themeService: ThemeService,private router:Router) {
    this.themeService.darkMode$.subscribe(mode => this.isDarkMode = mode);
    this.db = new PouchDB('http://Harishwar:harish22@localhost:5984/moodtracker');
    this.db.sync('http://Harishwar:harish22@localhost:5984/moodtracker', {
      live: true,
      retry: true
    }).on('change', () => {
      this.loadMoodData();
    });
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  ngOnInit(): void {
    this.loadMoodData();
  }

  async loadMoodData() {
    try {
      const currentUserId = localStorage.getItem('username');
    if (!currentUserId) {
    console.warn('No logged-in user found.');
    return;
    }
      const result = await this.db.allDocs({ include_docs: true });
      const docs = result.rows
        .map(r => r.doc)
        .filter((doc): doc is MoodEntry => !!doc?.date && typeof doc.moodScore === 'number');

      const cutoff = this.getCutoffDate();
      const filtered = docs
        .filter(d => new Date(d.date) >= cutoff && d.userId === currentUserId)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      this.barChartData.labels = filtered.map(d => d.date);
      const moodScores = filtered.map(d => d.moodScore);
      const barColors = moodScores.map(score => {
        return '#bb86fc';
      });

      this.barChartData.datasets[0] = {
        data: moodScores,
        label: 'Mood',
        backgroundColor: barColors
      }

      const sum = this.barChartData.datasets[0].data.reduce((a, b) => a + b, 0);
      this.averageMood = filtered.length > 0 ? +(sum / filtered.length).toFixed(0) : 0;
      this.barChartData = { ...this.barChartData };
      this.updatePieChartData(filtered);

    } catch (error) {
      console.error('Failed to load mood data:', error);
    }
  }

  getCutoffDate(): Date {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const days = this.filterRange === '7d' ? 6 : 29;
    now.setDate(now.getDate() - days);
    return now;
  }

  onFilterChange(range: '7d' | '30d') {
    this.filterRange = range;
    this.loadMoodData();
  }

pieChartData: ChartData<'pie', number[], string> = {
  datasets: [
    {
      data: [0, 0, 0, 0, 0],
      backgroundColor: ['#e57373', '#f06292', '#ba68c8', '#64b5f6', '#81c784']
    }
  ]
}
pieChartType: ChartType = 'pie';
readonly moodColorMap: Record<string, string> = {
  happy: '#4caf50',    // Green
  sad: '#2196f3',      // Blue
  angry: '#f44336',    // Red
  excited: '#ff9800',  // Orange
  neutral: '#9e9e9e'   // Gray
};
readonly moodLabels: Record<string, string> = {
  happy: '😊 Happy',
  sad: '😢 Sad',
  angry: '😠 Angry',
  excited: '🤩 Excited',
  neutral: '😐 Neutral'
};
updatePieChartData(entries: MoodEntry[]) {
  const moods = ['happy', 'sad', 'angry', 'excited', 'neutral'];
  const moodCounts: Record<string, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    excited: 0,
    neutral: 0
  };

  entries.forEach(entry => {
    const mood = entry.mood.toLowerCase();
    if (moodCounts[mood] !== undefined) {
      moodCounts[mood]++;
    }
  });

  this.pieChartData = {
    labels:  moods.map(m => this.moodLabels[m]),
    datasets: [
      {
        data: moods.map(m => moodCounts[m]),
        backgroundColor: moods.map(m => this.moodColorMap[m])
      }
    ]
  };
}
goToHomePage(){
  this.router.navigate(['/home']);
}
}
