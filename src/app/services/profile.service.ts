import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Profile } from '../models/profile.model';
import { BehaviorSubject, Observable, map } from 'rxjs';

interface ProfilesResponse {
  id: string;
  profile: Profile[];
}

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  baseApiUrl: string = environment.baseApiUrl
  constructor(private http: HttpClient) { }

  getAllProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.baseApiUrl}/api/Authentication`);
  }

  setUserProfile(profile: any): void {
    this.userProfileSubject.next(profile);
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

  getUsername(id: number): Observable<string> {
    return this.http.get<{ username: string }>(`${this.baseApiUrl}/api/Profile/${id}/username`)
      .pipe(map(response => response.username));
  }

  suspendUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/api/Profile/${userId}/suspend`, {});
  }

  unsuspendUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/api/Profile/${userId}/unsuspend`, {});
  }

  private userProfile: any;
  private userProfileSubject = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject.asObservable();


}
