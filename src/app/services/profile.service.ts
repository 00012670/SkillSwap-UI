import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Profile } from '../models/profile.model';
import { Observable } from 'rxjs';

interface ProfilesResponse {
  $id: string;
  $values: Profile[];
}

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  baseApiUrl: string = environment.baseApiUrl
  constructor(private http: HttpClient) { }

  getAllProfiles(): Observable<ProfilesResponse> {
    return this.http.get<ProfilesResponse>(`${this.baseApiUrl}/api/Authentication`);
  }

  getProfileById(userId: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseApiUrl}/api/Profile/${userId}`);
  }

  updateProfile(userId: number, updateProfileRequest: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.baseApiUrl}/api/Profile/${userId}`, updateProfileRequest);
  }

  deleteProfile(userId: number): Observable<Profile> {
    return this.http.delete<Profile>(`${this.baseApiUrl}/api/Profile/${userId}`);
  }
}
