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
  constructor(private http: HttpClient) { }

  getSKillbyId(id: number): Observable<Skill> {
    return this.http.get<Skill>(this.baseApiUrl + '/api/Skills/GetSkillBy/' + id);
  }

  addSkill(userId: number, addSkillRequest: any): Observable<Skill> {
    return this.http.post<Skill>(this.baseApiUrl + '/api/Skills/AddSkillToUser/' + userId, addSkillRequest);
  }

  updateSkill(id: number, updateSkillRequest: Skill): Observable<Skill> {
    return this.http.put<Skill>(this.baseApiUrl + '/api/Skills/UpdateSkillBy/' + id, updateSkillRequest);
  }

  removeSkill(id: number): Observable<Skill> {
    return this.http.delete<Skill>(this.baseApiUrl + '/api/Skills/DeleteSkillBy/' + id);
  }

  getAllSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.baseApiUrl + '/api/Skills/GetAllSkills');
  }

  getSkillsByUserId(userId: number): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.baseApiUrl}/api/Skills/GetSkillsByUserId/${userId}`);
  }

  getSkillAndUserById(id: number): Observable<Skill> {
    return this.http.get<Skill>(`${this.baseApiUrl}/api/Skills/GetSkillAndUserBy/${id}`);
  }


}
