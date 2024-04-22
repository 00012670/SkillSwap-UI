import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'
import { environment } from 'src/environments/environment';
import { TokenApiModel } from '../models/token-api.model';
import { Observable } from 'rxjs';

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
      const userId = decodedToken.nameid;
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
    console.log('renewing token');
    return this.http.post<any>(`${this.baseApiUrl}/api/Authentication/Refresh`, tokenApi)
  }

  LoginWithGoogle(idToken: string): Observable<any> {
    const header = new HttpHeaders().set("Content-type", "application/json");
    const body = { IdToken: idToken };
    return this.http.post(this.baseApiUrl + "/api/Authentication/LoginWithGoogle", JSON.stringify(body), {
      headers: header
    });
  }
}
