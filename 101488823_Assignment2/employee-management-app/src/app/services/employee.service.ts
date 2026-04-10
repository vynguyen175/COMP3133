import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  GET_ALL_EMPLOYEES,
  SEARCH_EMPLOYEE_BY_ID,
  SEARCH_EMPLOYEE_BY_DESIGNATION_OR_DEPARTMENT,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE
} from '../graphql/graphql.queries';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees() {
    return this.apollo.query<any>({
      query: GET_ALL_EMPLOYEES,
      fetchPolicy: 'network-only'
    }).pipe(map(result => result.data.getAllEmployees));
  }

  getEmployeeById(eid: string) {
    return this.apollo.query<any>({
      query: SEARCH_EMPLOYEE_BY_ID,
      variables: { eid },
      fetchPolicy: 'network-only'
    }).pipe(map(result => result.data.searchEmployeeById));
  }

  searchEmployees(designation?: string, department?: string) {
    return this.apollo.query<any>({
      query: SEARCH_EMPLOYEE_BY_DESIGNATION_OR_DEPARTMENT,
      variables: { designation, department },
      fetchPolicy: 'network-only'
    }).pipe(map(result => result.data.searchEmployeeByDesignationOrDepartment));
  }

  addEmployee(employee: any) {
    return this.apollo.mutate<any>({
      mutation: ADD_EMPLOYEE,
      variables: employee
    }).pipe(map(result => result.data.addEmployee));
  }

  updateEmployee(eid: string, employee: any) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_EMPLOYEE,
      variables: { eid, ...employee }
    }).pipe(map(result => result.data.updateEmployee));
  }

  deleteEmployee(eid: string) {
    return this.apollo.mutate<any>({
      mutation: DELETE_EMPLOYEE,
      variables: { eid }
    }).pipe(map(result => result.data.deleteEmployee));
  }
}
