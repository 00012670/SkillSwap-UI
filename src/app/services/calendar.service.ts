import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient, private profileService: ProfileService) { }

  createEvent(data: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/api/Calendar/createevent`, data);
}




  getCalendars(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/calendar/GetAllEvents`);
  }

  getCalendar(id: number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/calendar/GetEvent${id}`);
  }

  createCalendar(calendar: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/calendar/CreateEvent`, calendar);
  }

  updateCalendar(id: number, calendar: any): Observable<any> {
    return this.http.put(`${this.baseApiUrl}/calendar/UpdateEvent${id}`, calendar);
  }

  deleteCalendar(id: number): Observable<any> {
    return this.http.delete(`${this.baseApiUrl}/calendar/DeleteEvent${id}`);
  }

}
