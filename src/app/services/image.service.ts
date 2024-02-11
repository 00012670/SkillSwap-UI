import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ImageResponse } from '../models/profile.model';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  uploadImage(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('formFile', file);

    return this.http.post(`${this.baseApiUrl}/api/Image/UploadImage/${userId}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  updateImage(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('formFile', file);

    return this.http.put(`${this.baseApiUrl}/api/Image/UpdateImage/${userId}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getImageByUserId(userId: number): Observable<ArrayBuffer> {
    return this.http.get<ArrayBuffer>(`${this.baseApiUrl}/api/Image/GetImageByUserId/${userId}`, {responseType: 'arraybuffer' as 'json'});
  }

  removeImage(userId: number): Observable<any> {
    return this.http.delete(`${this.baseApiUrl}/api/Image/RemoveImage/${userId}`);
  }
}
