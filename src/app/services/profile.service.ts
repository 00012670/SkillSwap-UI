import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Profile } from '../models/profile.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  baseApiUrl: string = environment.baseApiUrl
  constructor(private http: HttpClient) { }

  getAllProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.baseApiUrl}/api/Profile`);
  }

  getProfileById(userId: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseApiUrl}/api/Profile/${userId}`);
  }

  updateProfile(userId: string, updateProfileRequest: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.baseApiUrl}/api/Profile/${userId}`, updateProfileRequest);
  }

  // getAllAuthentications() {
  //   return this.http.get(this.baseApiUrl + "/api/Authentication/");
  // }

  // getProfileById(userId: any): Observable<Profile> {
  //   return this.http.get<Profile>(this.baseApiUrl + "/api/Profile/" + userId);
  // }

  // updateProfile(userId: string, updateProfileRequest: Profile): Observable<Profile> {
  //   return this.http.put<Profile>(this.baseApiUrl + '/api/Profile/' + userId, updateProfileRequest);
  // }

  uploadImage(inpudata: any) {
    return this.http.post(this.baseApiUrl + '/api/Profile/UploadImage', inpudata, {
      reportProgress: true,
      observe: 'events'
    });
  }

  removeImage(code: any) {
    return this.http.get(this.baseApiUrl + '/api/Profile/RemoveImage/' + code);
  }
}
