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
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo, private ngZone: NgZone) {}

  private wrapQuery<T>(promise: Promise<any>, extract: (data: any) => T): Observable<T> {
    return new Observable<T>(subscriber => {
      promise.then(
        result => {
          this.ngZone.run(() => {
            subscriber.next(extract(result.data));
            subscriber.complete();
          });
        },
        error => {
          this.ngZone.run(() => {
            subscriber.error(error);
            subscriber.complete();
          });
        }
      );
    });
  }

  getAllEmployees(): Observable<any[]> {
    return this.wrapQuery(
      this.apollo.client.query({ query: GET_ALL_EMPLOYEES, fetchPolicy: 'network-only' }),
      data => data.getAllEmployees
    );
  }

  getEmployeeById(eid: string): Observable<any> {
    return this.wrapQuery(
      this.apollo.client.query({ query: SEARCH_EMPLOYEE_BY_ID, variables: { eid }, fetchPolicy: 'network-only' }),
      data => data.searchEmployeeById
    );
  }

  searchEmployees(designation?: string, department?: string): Observable<any[]> {
    return this.wrapQuery(
      this.apollo.client.query({ query: SEARCH_EMPLOYEE_BY_DESIGNATION_OR_DEPARTMENT, variables: { designation, department }, fetchPolicy: 'network-only' }),
      data => data.searchEmployeeByDesignationOrDepartment
    );
  }

  addEmployee(employee: any): Observable<any> {
    return this.wrapQuery(
      this.apollo.client.mutate({ mutation: ADD_EMPLOYEE, variables: employee }),
      data => data.addEmployee
    );
  }

  updateEmployee(eid: string, employee: any): Observable<any> {
    return this.wrapQuery(
      this.apollo.client.mutate({ mutation: UPDATE_EMPLOYEE, variables: { eid, ...employee } }),
      data => data.updateEmployee
    );
  }

  deleteEmployee(eid: string): Observable<any> {
    return this.wrapQuery(
      this.apollo.client.mutate({ mutation: DELETE_EMPLOYEE, variables: { eid } }),
      data => data.deleteEmployee
    );
  }
}
