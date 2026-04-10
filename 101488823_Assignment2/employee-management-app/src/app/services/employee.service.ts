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

  private fromPromise<T>(promise: Promise<any>, extract: (data: any) => T): Observable<T> {
    return new Observable<T>(subscriber => {
      promise.then(
        result => this.ngZone.run(() => {
          subscriber.next(extract(result));
          subscriber.complete();
        }),
        error => this.ngZone.run(() => {
          subscriber.error(error);
        })
      );
    });
  }

  getAllEmployees() {
    return this.fromPromise(
      this.apollo.client.query<any>({ query: GET_ALL_EMPLOYEES, fetchPolicy: 'network-only' }),
      result => result.data.getAllEmployees
    );
  }

  getEmployeeById(eid: string) {
    return this.fromPromise(
      this.apollo.client.query<any>({ query: SEARCH_EMPLOYEE_BY_ID, variables: { eid }, fetchPolicy: 'network-only' }),
      result => result.data.searchEmployeeById
    );
  }

  searchEmployees(designation?: string, department?: string) {
    return this.fromPromise(
      this.apollo.client.query<any>({ query: SEARCH_EMPLOYEE_BY_DESIGNATION_OR_DEPARTMENT, variables: { designation, department }, fetchPolicy: 'network-only' }),
      result => result.data.searchEmployeeByDesignationOrDepartment
    );
  }

  addEmployee(employee: any) {
    return this.fromPromise(
      this.apollo.client.mutate<any>({ mutation: ADD_EMPLOYEE, variables: employee }),
      result => result.data.addEmployee
    );
  }

  updateEmployee(eid: string, employee: any) {
    return this.fromPromise(
      this.apollo.client.mutate<any>({ mutation: UPDATE_EMPLOYEE, variables: { eid, ...employee } }),
      result => result.data.updateEmployee
    );
  }

  deleteEmployee(eid: string) {
    return this.fromPromise(
      this.apollo.client.mutate<any>({ mutation: DELETE_EMPLOYEE, variables: { eid } }),
      result => result.data.deleteEmployee
    );
  }
}
