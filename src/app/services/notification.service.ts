import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }


  getNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.baseApiUrl + '/api/Notification/GetNotifications/' + userId);
  }

  deleteAllNotifications(userId: number) {
    return this.http.delete(this.baseApiUrl+'/api/Notification/DeleteAllNotifications/' + userId, {});
  }
}
