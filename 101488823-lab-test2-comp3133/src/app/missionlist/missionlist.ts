import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UpperCasePipe } from '@angular/common';
import { Spacexapi } from '../network/spacexapi';
import { Mission } from '../models/mission';

@Component({
  selector: 'app-missionlist',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatProgressSpinnerModule, UpperCasePipe],
  templateUrl: './missionlist.html',
  styleUrl: './missionlist.css',
})
export class Missionlist implements OnInit {
  missions = signal<Mission[]>([]);
  loading = signal(true);

  constructor(private spacexApi: Spacexapi) {}

  ngOnInit(): void {
    this.spacexApi.getAllMissions().subscribe({
      next: (data) => {
        this.missions.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching missions:', err);
        this.loading.set(false);
      }
    });
  }
}
