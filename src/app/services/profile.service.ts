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
    return this.http.get<Profile[]>(`${this.baseApiUrl}/api/Authentication`);
  }

  getProfileById(id: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseApiUrl}/api/Profile/${id}`);
  }

  updateProfile(id: string, updateProfileRequest: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.baseApiUrl}/api/Profile/${id}`, updateProfileRequest);
  }

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
