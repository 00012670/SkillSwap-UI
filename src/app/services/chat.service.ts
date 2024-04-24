import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProfileService } from './profile.service';
import { MessageDto } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})


export class ChatService {


  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient, private profileService: ProfileService) { }

  getMessages(senderId: number, receiverId: number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/Message/ReceiveMessage/${senderId}/${receiverId}`);
  }

  sendMessage(messageDto: MessageDto): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/api/Message/SendMessage`, messageDto);
  }

  updateMessage(id: number, messageDto: MessageDto): Observable<any> {
    return this.http.put(`${this.baseApiUrl}/api/Message/UpdateMessage/${id}`, messageDto);
  }

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.baseApiUrl}/api/Message/DeleteMessage/${id}`);
  }

  getUnreadMessageCount(senderId: number, receiverId: number): Observable<number> {
    return this.http.get<number>(`${this.baseApiUrl}/api/Message/GetUnreadMessageCount/${senderId}/${receiverId}`);
  }

  markMessagesAsRead(senderId: number, receiverId: number): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/api/Message/MarkMessagesAsRead/${senderId}/${receiverId}`, {});
  }
}
