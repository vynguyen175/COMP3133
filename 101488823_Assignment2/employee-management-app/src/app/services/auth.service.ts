import { Injectable, NgZone } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { LOGIN, SIGNUP } from '../graphql/graphql.queries';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo, private router: Router, private ngZone: NgZone) {}

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

  login(usernameOrEmail: string, password: string) {
    return this.fromPromise(
      this.apollo.client.query<any>({
        query: LOGIN,
        variables: { usernameOrEmail, password },
        fetchPolicy: 'network-only'
      }),
      result => {
        const data = result.data.login;
        if (data?.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
      }
    );
  }

  signup(username: string, email: string, password: string) {
    return this.fromPromise(
      this.apollo.client.mutate<any>({
        mutation: SIGNUP,
        variables: { username, email, password }
      }),
      result => result.data.signup
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.apollo.client.clearStore();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
