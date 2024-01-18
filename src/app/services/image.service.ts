import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ImageService {

  baseApiUrl: string = environment.baseApiUrl
  constructor(private http: HttpClient) { }

  uploadImage(inpudata: FormData) {
    return this.http.post(this.baseApiUrl + '/api/Image/DBUploadImage', inpudata, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getAllImages() {
    return this.http.get(this.baseApiUrl + '/api/Image/GetDBAllImages');
  }

  getImagebyId(imgCode: any) {
    return this.http.get(this.baseApiUrl + '/api/Image/GetDBImagebyId?imgCode=' + imgCode);
  }


  removeImage(code: any) {
    return this.http.get(this.baseApiUrl + '/api/Image/RemoveImage/' + code);
  }
}
