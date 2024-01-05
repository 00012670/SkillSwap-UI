import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
//import {JwtHelperService} from '@auth0/angular-jwt'
//import { TokenApiModel } from '../models/token-api.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = 'https://localhost:7222/api/Authentication/'
  private userPayload: any;
  //router: any;
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    //this.userPayload = this.decodedToken();
  }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj)
  }

  signIn(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj)
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
    console.log('Token:', token);
    return token;
  }

  // getRefreshToken(){
  //   return localStorage.getItem('refreshToken')
  // }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }

  // decodedToken() {
  //   try {
  //     const jwtHelper = new JwtHelperService();
  //     const token = this.getToken()!;
  //     console.log('Decoding token:', token);
  //     console.log(jwtHelper.decodeToken(token));
  //     return jwtHelper.decodeToken(token);
  //   } catch (error) {
  //     console.error('Error decoding token:', error);
  //     return null;
  //   }
  // }



  //   getfullNameFromToken(){
  //     if(this.userPayload)
  //     return this.userPayload.name;
  //   }

  //   getRoleFromToken(){
  //     if(this.userPayload)
  //     return this.userPayload.role;
  //   }

  //   renewToken(tokenApi : TokenApiModel){
  //     return this.http.post<any>(`${this.baseUrl}refresh`, tokenApi)
  //   }
}
