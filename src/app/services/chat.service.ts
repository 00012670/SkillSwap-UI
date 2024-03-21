import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getMessages(senderId: number, receiverId: number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/Message/ReceiveMessage/${senderId}/${receiverId}`);
  }


  sendMessage(senderId: number, receiverId: number, messageText: string, senderImage: string): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/api/Message/SendMessage`, { senderId, receiverId, messageText, senderImage });
  }


}
