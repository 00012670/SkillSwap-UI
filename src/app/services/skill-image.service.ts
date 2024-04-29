import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


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
    return this.http.get<ArrayBuffer>(`${this.baseApiUrl}/api/SkillImage/GetSkillImageBySkillId/${skillId}`, { responseType: 'arraybuffer' as 'json' });
  }

  getImageBySkillIdAsSafeUrl(skillId: number, skillImageService: SkillImageService, sanitizer: DomSanitizer): Promise<SafeUrl | undefined> {
    return new Promise((resolve, reject) => {
      skillImageService.getImageBySkillId(skillId).subscribe({
        next: response => {
          const blob = new Blob([response], { type: 'image/jpeg' });
          const blobUrl = URL.createObjectURL(blob);
          const imageSkillUrl = sanitizer.bypassSecurityTrustUrl(blobUrl);
          resolve(imageSkillUrl);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            resolve(undefined);
          } else {
            console.error('Failed to get image', error);
            reject(error);
          }
        }
      });
    });
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
  }
}
