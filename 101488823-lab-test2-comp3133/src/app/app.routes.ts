import { Routes } from '@angular/router';
import { Missionlist } from './missionlist/missionlist';
import { Missiondetails } from './missiondetails/missiondetails';
import { Missionfilter } from './missionfilter/missionfilter';

export const routes: Routes = [
  { path: '', redirectTo: 'missions', pathMatch: 'full' },
  { path: 'missions', component: Missionlist },
  { path: 'missions/filter', component: Missionfilter },
  { path: 'missions/:flight_number', component: Missiondetails },
];
