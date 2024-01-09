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
  constructor(private http: HttpClient) {}

  getProfile(id: string): Observable<Profile> {
    return this.http.get<Profile>(this.baseApiUrl + '/api/profile/' + id);
  }

  updateProfile(id: string, updateSkillRequest: Profile): Observable<Profile> {
    return this.http.put<Profile>(this.baseApiUrl + '/api/profile/' + id, updateSkillRequest);
  }

}
