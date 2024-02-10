import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseApiUrl: string = environment.baseApiUrl
  private userPayload: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.userPayload = this.decodedToken();
  }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseApiUrl}/api/Authentication/register`, userObj)
  }

  signIn(loginObj: any) {
    return this.http.post<any>(`${this.baseApiUrl}/api/Authentication/authenticate`, loginObj).pipe(
      tap(response => {
        if (response && response.userId) {
          localStorage.setItem('userId', response.userId.toString());
         // console.log(response)
        }
      })
    );
  }

  getUserId() {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['login'])
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }
  storeRefreshToken(tokenValue: string) {
    localStorage.setItem('refreshToken', tokenValue)
  }

  getToken() {
    const token = localStorage.getItem('token');
    return token;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }

  decodedToken() {
    try {
      const jwtHelper = new JwtHelperService();
      const token = this.getToken();
      if (token) {
       // console.log('Decoding token:', token);
        return jwtHelper.decodeToken(token);
      } else {
        return {};
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return {}; // Return an empty object or any default value
    }
  }

  getUsernameFromToken() {
    if (this.userPayload)
      return this.userPayload.name;
  }

  getRoleFromToken() {
    if (this.userPayload)
      return this.userPayload.role;
  }

}
