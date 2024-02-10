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
    return this.http.post<any>(`${this.baseApiUrl}/api/Authentication/register`, userObj).pipe(
      tap(response => {
        if (response && response.skills && response.skills.length > 0) {
          const userId = response.skills[0].userId;
          localStorage.setItem('userId', userId.toString());
        }
      })
    )
  }

  signIn(loginObj: any) {
    return this.http.post<any>(`${this.baseApiUrl}/api/Authentication/authenticate`, loginObj).pipe(
      tap(response => {
        if (response && response.skills && response.skills.length > 0) {
          const userId = response.skills[0].userId;
          localStorage.setItem('userId', userId.toString());
        }
      })
    );
  }

  getUserId() {
    const token = this.getToken();
    if (token) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      const userId = decodedToken.userId;
      if (userId) {
        console.log('Retrieved userId from token:', userId);
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
        return jwtHelper.decodeToken(token);
      } else {
        return {};
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return {};
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
