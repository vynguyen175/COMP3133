import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getFilteredMissions(filters: { launch_year?: string; launch_success?: string; land_success?: string }): Observable<Mission[]> {
    let params = new HttpParams();
    if (filters.launch_year) params = params.set('launch_year', filters.launch_year);
    if (filters.launch_success) params = params.set('launch_success', filters.launch_success);
    if (filters.land_success) params = params.set('land_success', filters.land_success);
    return this.http.get<Mission[]>(`${this.apiUrl}/launches`, { params });
  }
}
