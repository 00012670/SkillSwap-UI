import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SkillImageService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  uploadImage(skillId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('formFile', file);

    return this.http.post(`${this.baseApiUrl}/api/SkillImage/UploadSkillImage/${skillId}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getImageBySkillId(skillId: number): Observable<ArrayBuffer> {
    return this.http.get<ArrayBuffer>(`${this.baseApiUrl}/api/SkillImage/GetSkillImageBySkillId/${skillId}`, {responseType: 'arraybuffer' as 'json'});
  }

  getImageById(skillId: number): Observable<ArrayBuffer> {
    return this.http.get(`${this.baseApiUrl}/api/SkillImage/GetSkillImage/${skillId}`, { responseType: 'arraybuffer' });
  }

  removeImage(skillId: number): Observable<any> {
    return this.http.delete(`${this.baseApiUrl}/api/SkillImage/RemoveSkillImage/${skillId}`);
  }

  uploadVideo(videoFile: File, skillId: number) {
    const formData = new FormData();
    formData.append('videoFile', videoFile);
    return this.http.post(`${this.baseApiUrl}/api/UploadVideo/${skillId}`, formData);
  }}
