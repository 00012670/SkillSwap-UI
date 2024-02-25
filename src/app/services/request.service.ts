import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CreateSwapRequest, GetSwapRequest, UpdateSwapRequest } from 'src/app/models/request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RequestService {

  baseApiUrl: string = environment.baseApiUrl
  constructor(private http: HttpClient) { }

  createSwapRequest(swapRequest: CreateSwapRequest): Observable<CreateSwapRequest> {
    return this.http.post<CreateSwapRequest>(`${this.baseApiUrl}/api/SwapRequest/CreateSwapRequest`, swapRequest);
  }

  getSwapRequests(userId: number): Observable<GetSwapRequest[]> {
    return this.http.get<GetSwapRequest[]>(`${this.baseApiUrl}/api/SwapRequest/ReceiveSwapRequests?userId=${userId}`);
  }

  getSentSwapRequests(userId: number): Observable<GetSwapRequest[]> {
    return this.http.get<GetSwapRequest[]>(`${this.baseApiUrl}/api/SwapRequest/GetSentSwapRequests?userId=${userId}`);
  }

  getSwapRequestsBySkillId(skillId: number): Observable<GetSwapRequest[]> {
    return this.http.get<GetSwapRequest[]>(`${this.baseApiUrl}/api/SwapRequest/GetBySkillId/${skillId}`);
  }

  updateSwapRequest(requestId: number, updatedSwapRequest: UpdateSwapRequest): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/api/SwapRequest/UpdateSwapRequest/${requestId}`, updatedSwapRequest);
  }

  deleteSwapRequest(requestId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/api/SwapRequest/DeleteSwapRequest/${requestId}`);
  }
}


