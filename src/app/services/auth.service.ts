import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { TokenApiModel } from '../models/token-api.model';
import { EMPTY, Observable } from 'rxjs';
import { throwError } from 'rxjs';

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
    return this.http.post<any>(`${this.baseApiUrl}/api/Authentication/register`, userObj).pipe(
    );
  }

  signIn(loginObj: any) {
    return this.http.post<any>(`${this.baseApiUrl}/api/Authentication/authenticate`, loginObj).pipe(
    );

  }

  getUserId() {
    const token = this.getToken();
    if (token) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      const userId = decodedToken.userId;
      if (userId) {
        // console.log('Retrieved userId from token:', userId);
        return userId;
      } else {
        console.log('No userId found in token');
        return null;
      }
    } else {
      console.log('No token found');
      return null;
    }
  }

  getUserFromToken() {
    if (this.userPayload)
      return this.userPayload;
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
    return localStorage.getItem('token')
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token))
    return jwtHelper.decodeToken(token)
  }

  getUsernameFromToken() {
    if (this.userPayload)
      return this.userPayload.name;
  }

  getRoleFromToken() {
    if (this.userPayload)
      return this.userPayload.role;
  }

  renewToken(tokenApi: TokenApiModel): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/api/Authentication/Refresh`, tokenApi)

  }

}
