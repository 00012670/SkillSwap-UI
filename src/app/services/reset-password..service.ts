import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResetPassword } from '../models/reset-password.model';


@Injectable({
  providedIn: 'root'
})

export class ResetPasswordService {


  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  sendResetPasswordLink(email: string){
    return this.http.post<any>(`${this.baseApiUrl}/api/Authentication/SendResetEmail/${email}`, {})
  }

  resetPassword(resetPasswordObj: ResetPassword) {
    return this.http.post<any>(`${this.baseApiUrl}/api/Authentication/ResetPassword`, resetPasswordObj)
  }
}
