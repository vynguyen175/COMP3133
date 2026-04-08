import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mission } from '../models/mission';

@Injectable({
  providedIn: 'root',
})
export class Spacexapi {
  private apiUrl = 'https://api.spacexdata.com/v3';

  constructor(private http: HttpClient) {}

  getAllMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.apiUrl}/launches`);
  }

  getMissionsByYear(year: string): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.apiUrl}/launches?launch_year=${year}`);
  }

  getMissionByFlightNumber(flightNumber: number): Observable<Mission> {
    return this.http.get<Mission>(`${this.apiUrl}/launches/${flightNumber}`);
  }
}
