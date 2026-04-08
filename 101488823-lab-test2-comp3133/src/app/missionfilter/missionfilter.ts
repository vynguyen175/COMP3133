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
  selectedLaunchSuccess = signal<string | null>(null);
  selectedLandSuccess = signal<string | null>(null);
  missions = signal<Mission[]>([]);
  loading = signal(false);

  constructor(private spacexApi: Spacexapi) {}

  ngOnInit(): void {
    for (let y = 2006; y <= 2020; y++) {
      this.years.push(y.toString());
    }

    this.yearControl.valueChanges.subscribe((year) => {
      if (year) {
        this.selectedYear.set(year);
        this.applyFilters();
      }
    });
  }

  filterByYear(year: string): void {
    this.selectedYear.set(year);
    this.yearControl.setValue(year, { emitEvent: false });
    this.applyFilters();
  }

  filterByLaunchSuccess(value: string): void {
    this.selectedLaunchSuccess.set(this.selectedLaunchSuccess() === value ? null : value);
    this.applyFilters();
  }

  filterByLandSuccess(value: string): void {
    this.selectedLandSuccess.set(this.selectedLandSuccess() === value ? null : value);
    this.applyFilters();
  }

  applyFilters(): void {
    this.loading.set(true);
    const filters: { launch_year?: string; launch_success?: string; land_success?: string } = {};
    if (this.selectedYear()) filters.launch_year = this.selectedYear();
    if (this.selectedLaunchSuccess() !== null) filters.launch_success = this.selectedLaunchSuccess()!;
    if (this.selectedLandSuccess() !== null) filters.land_success = this.selectedLandSuccess()!;

    this.spacexApi.getFilteredMissions(filters).subscribe({
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

  getLandSuccess(mission: Mission): string {
    if (mission.rocket?.first_stage?.cores?.length > 0) {
      const land = mission.rocket.first_stage.cores[0].land_success;
      if (land === true) return 'Yes';
      if (land === false) return 'No';
    }
    return 'No Data';
  }
}
