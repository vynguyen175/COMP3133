import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Spacexapi } from '../network/spacexapi';
import { Mission } from '../models/mission';

@Component({
  selector: 'app-missiondetails',
  imports: [RouterLink, DatePipe, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './missiondetails.html',
  styleUrl: './missiondetails.css',
})
export class Missiondetails implements OnInit {
  mission = signal<Mission | null>(null);
  loading = signal(true);

  constructor(private route: ActivatedRoute, private spacexApi: Spacexapi) {}

  ngOnInit(): void {
    const flightNumber = Number(this.route.snapshot.paramMap.get('flight_number'));
    this.spacexApi.getMissionByFlightNumber(flightNumber).subscribe({
      next: (data) => {
        this.mission.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching mission details:', err);
        this.loading.set(false);
      }
    });
  }
}
