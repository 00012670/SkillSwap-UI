import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ImageResponse } from '../models/image.model';


@Injectable({
  providedIn: 'root'
})

export class ImageService {

  baseApiUrl: string = environment.baseApiUrl
  constructor(private http: HttpClient) { }

  getImagebyId(imgCode: any): Observable<ImageResponse> {
    return this.http.get<ImageResponse>(this.baseApiUrl + '/api/Image/GetDBImagebyId?imgCode=' + imgCode); 
  }

  getAllImages() {
    return this.http.get(this.baseApiUrl + '/api/Image/GetDBAllImages');
  }

  uploadImage(imgCode: string, userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseApiUrl}/api/Image/DBUploadImage?imgCode=${imgCode}&userId=${userId}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  removeImage(imgCode: any) {
    return this.http.get(this.baseApiUrl + '/api/Image/RemoveDBImage/' + imgCode);
  }
}
