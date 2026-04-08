import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Spacexapi } from '../network/spacexapi';
import { Mission } from '../models/mission';

@Component({
  selector: 'app-missionfilter',
  imports: [RouterLink, ReactiveFormsModule, MatButtonModule, MatCardModule, MatChipsModule, MatProgressSpinnerModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './missionfilter.html',
  styleUrl: './missionfilter.css',
})
export class Missionfilter implements OnInit {
  years: string[] = [];
  yearControl = new FormControl('');
  selectedYear = signal('');
  missions = signal<Mission[]>([]);
  loading = signal(false);

  constructor(private spacexApi: Spacexapi) {}

  ngOnInit(): void {
    for (let y = 2006; y <= 2020; y++) {
      this.years.push(y.toString());
    }

    this.yearControl.valueChanges.subscribe((year) => {
      if (year) {
        this.filterByYear(year);
      }
    });
  }

  filterByYear(year: string): void {
    this.selectedYear.set(year);
    this.loading.set(true);
    this.spacexApi.getMissionsByYear(year).subscribe({
      next: (data) => {
        this.missions.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error filtering missions:', err);
        this.loading.set(false);
      }
    });
  }
}
