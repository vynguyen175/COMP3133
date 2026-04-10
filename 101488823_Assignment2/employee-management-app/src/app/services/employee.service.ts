import { Injectable, NgZone } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  GET_ALL_EMPLOYEES,
  SEARCH_EMPLOYEE_BY_ID,
  SEARCH_EMPLOYEE_BY_DESIGNATION_OR_DEPARTMENT,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE
} from '../graphql/graphql.queries';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo, private ngZone: NgZone) {}

  getAllEmployees(): Observable<any[]> {
    return from(
      this.apollo.client.query({ query: GET_ALL_EMPLOYEES, fetchPolicy: 'network-only' })
    ).pipe(map((result: any) => {
      return this.ngZone.run(() => result.data.getAllEmployees);
    }));
  }

  getEmployeeById(eid: string): Observable<any> {
    return from(
      this.apollo.client.query({ query: SEARCH_EMPLOYEE_BY_ID, variables: { eid }, fetchPolicy: 'network-only' })
    ).pipe(map((result: any) => {
      return this.ngZone.run(() => result.data.searchEmployeeById);
    }));
  }

  searchEmployees(designation?: string, department?: string): Observable<any[]> {
    return from(
      this.apollo.client.query({ query: SEARCH_EMPLOYEE_BY_DESIGNATION_OR_DEPARTMENT, variables: { designation, department }, fetchPolicy: 'network-only' })
    ).pipe(map((result: any) => {
      return this.ngZone.run(() => result.data.searchEmployeeByDesignationOrDepartment);
    }));
  }

  addEmployee(employee: any): Observable<any> {
    return from(
      this.apollo.client.mutate({ mutation: ADD_EMPLOYEE, variables: employee })
    ).pipe(map((result: any) => {
      return this.ngZone.run(() => result.data.addEmployee);
    }));
  }

  updateEmployee(eid: string, employee: any): Observable<any> {
    return from(
      this.apollo.client.mutate({ mutation: UPDATE_EMPLOYEE, variables: { eid, ...employee } })
    ).pipe(map((result: any) => {
      return this.ngZone.run(() => result.data.updateEmployee);
    }));
  }

  deleteEmployee(eid: string): Observable<any> {
    return from(
      this.apollo.client.mutate({ mutation: DELETE_EMPLOYEE, variables: { eid } })
    ).pipe(map((result: any) => {
      return this.ngZone.run(() => result.data.deleteEmployee);
    }));
  }
}
