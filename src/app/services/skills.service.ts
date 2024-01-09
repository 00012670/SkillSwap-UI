import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Skill } from '../models/skill.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {

  baseApiUrl: string = environment.baseApiUrl
  constructor(private http: HttpClient) {}

  getAllSkills(): Observable<Skill[]> {
     return this.http.get<Skill[]>(this.baseApiUrl + '/api/Skills');
  }

  addSkill(addSkillRequest: Skill): Observable<Skill> {
    addSkillRequest.id = '0';
    return this.http.post<Skill>(this.baseApiUrl + '/api/skills',
    addSkillRequest)
  }

  getSKill(id: string): Observable<Skill> {
    return this.http.get<Skill>(this.baseApiUrl + '/api/skills/' + id);
  }

  updateSkill(id: string, updateSkillRequest: Skill): Observable<Skill> {
    return this.http.put<Skill>(this.baseApiUrl + '/api/skills/' + id, updateSkillRequest);
  }

  deleteSkill(id: string): Observable<Skill> {
    return this.http.delete<Skill>(this.baseApiUrl + '/api/skills/' + id);
  }
}