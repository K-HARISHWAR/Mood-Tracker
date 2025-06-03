import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { MoodAuthService } from './moodauth.service';

export interface MoodEntry {
  _id: string;
  _rev?: string;
  userId: string;
  date: string;
  mood: 'happy' | 'sad' | 'angry' | 'excited' | 'neutral';
  moodScore: number;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private couchdbUrl = 'http://localhost:5984/moodtracker';
  private dbUsername = 'Harishwar';
  private dbPassword = 'harish22';

  private authHeader: HttpHeaders;

  constructor(private http: HttpClient, private moodAuthService: MoodAuthService) {
    const credentials = btoa(`${this.dbUsername}:${this.dbPassword}`);
    this.authHeader = new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    });
  }

  private getUsername(): string {
    return this.moodAuthService.getUsername();
  }

  addOrUpdateEntry(entry: Omit<MoodEntry, '_id' | 'userId' | '_rev'>): Observable<any> {
    const username = this.getUsername();
    const dateStr = entry.date.split('T')[0];
    const docId = `${username}_${dateStr}`;
    const url = `${this.couchdbUrl}/${docId}`;

    return this.http.get<MoodEntry>(url, { headers: this.authHeader }).pipe(
      switchMap(existingDoc => {
        alert('Updated the Mood Entry for this Date');
        const updatedEntry: MoodEntry = {
          ...entry,
          _id: docId,
          userId: username,
          _rev: existingDoc._rev,
          date: entry.date
        };
        return this.http.put(url, updatedEntry, { headers: this.authHeader });
      }),
      catchError(err => {
        if (err.status === 404) {
          const newEntry: MoodEntry = {
            ...entry,
            _id: docId,
            userId: username,
            date: entry.date
          };
          return this.http.put(url, newEntry, { headers: this.authHeader });
        } else {
          return throwError(() => err);
        }
      })
    );
  }

  getUserEntries(): Observable<any> {
    const username = this.getUsername();
    const body = {
      selector: {
        userId: username
      },
      sort: [{ date: 'desc' }]
    };

    return this.http.post(`${this.couchdbUrl}/_find`, body, {
      headers: this.authHeader,
      withCredentials: true
    });
  }

  updateEntry(entry: MoodEntry): Observable<any> {
    return this.http.put(`${this.couchdbUrl}/${entry._id}`, entry, {
      headers: this.authHeader,
      withCredentials: true
    });
  }

  deleteEntry(entry: MoodEntry): Observable<any> {
    return this.http.delete(`${this.couchdbUrl}/${entry._id}?rev=${entry._rev}`, {
      headers: this.authHeader,
      withCredentials: true
    });
  }

  getUserMoodDates(userId: string): Observable<string[]> {
    const query = {
      selector: { userId },
      sort: [{ date: 'desc' }],
      fields: ['date'],
      limit: 100
    };

    return this.http.post<{ docs: { date: string }[] }>(
      `${this.couchdbUrl}/_find`,
      query,
      { headers: this.authHeader }
    ).pipe(
      map(res => res.docs.map(doc => doc.date))
    );
  }

  getUserMoodStats(userId: string): Observable<{ total: number; frequentMood: string }> {
    const query = {
      selector: { userId },
      fields: ['mood'],
      limit: 1000
    };

    return this.http.post<{ docs: { mood: string }[] }>(
      `${this.couchdbUrl}/_find`,
      query,
      { headers: this.authHeader }
    ).pipe(
      map(res => {
        const moodCounts: { [mood: string]: number } = {};
        for (const doc of res.docs) {
          moodCounts[doc.mood] = (moodCounts[doc.mood] || 0) + 1;
        }
        const mostFrequent = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
        return {
          total: res.docs.length,
          frequentMood: mostFrequent
        };
      })
    );
  }

  getRecentMoods(userId: string): Observable<{ mood: string; note: string; date: string }[]> {
    const query = {
      selector: { userId },
      sort: [{ date: 'desc' }],
      limit: 3,
      fields: ['mood', 'note', 'date']
    };

    return this.http.post<{ docs: { mood: string; note?: string; date: string }[] }>(
      `${this.couchdbUrl}/_find`,
      query,
      { headers: this.authHeader }
    ).pipe(
      map(res =>
        res.docs.map(doc => ({
          mood: doc.mood,
          note: doc.note || '',
          date: doc.date
        }))
      )
    );
  }
}
