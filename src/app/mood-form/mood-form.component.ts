import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MoodService } from '../services/mood.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-mood-form',
  standalone:true,
  imports :[ReactiveFormsModule,CommonModule],
  templateUrl: './mood-form.component.html',
  styleUrls: ['./mood-form.component.css']
})
export class MoodFormComponent{
  isDarkMode= false;
  moodForm: FormGroup;
  submitting = false;
  successMessage = '';
  errorMessage = '';

  moods = ['happy', 'sad', 'angry', 'excited', 'neutral'];

  constructor(private fb: FormBuilder, private moodService: MoodService,private themeService: ThemeService) {
    this.moodForm = this.fb.group({
      date: ['', [Validators.required]],
      mood: ['', Validators.required],
      moodScore: [, [Validators.required, Validators.min(1), Validators.max(5)]],
      note: ['']
    });
  }
   toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
  onSubmit() {
    if (this.moodForm.invalid) return;

    this.submitting = true;
    const formValue = this.moodForm.value;
    const formattedDate = formValue.date instanceof Date
    ? formValue.date.toISOString().split('T')[0]
    : new Date(formValue.date).toISOString().split('T')[0];
    const entryData = {
      date: formattedDate,
      mood: formValue.mood,
      moodScore: formValue.moodScore,
      note: formValue.note
    };

    this.moodService.addOrUpdateEntry(entryData).subscribe({
      next: (res) => {
        console.log("Mood saved successfully");
        this.moodForm.reset({
          date: '',
          mood: '',
          moodScore: null,
          note: ''
        });
        this.submitting = false;
      },
      error: (err) => {
        console.log("Error in saving Mood");
        this.submitting = false;
      }
    });
  }
}
