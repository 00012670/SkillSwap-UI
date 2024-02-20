import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SwapRequest, Status } from 'src/app/models/request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RequestService {

  baseApiUrl: string = environment.baseApiUrl
  constructor(private http: HttpClient) { }

  createSwapRequest(swapRequest: SwapRequest): Observable<SwapRequest> {
    return this.http.post<SwapRequest>(`${this.baseApiUrl}/api/SwapRequest/CreateSwapRequest`, swapRequest);
  }

  getSwapRequests(userId: number): Observable<SwapRequest[]> {
    return this.http.get<SwapRequest[]>(`${this.baseApiUrl}/api/SwapRequest/GetSwapRequests?userId=${userId}`);
  }

  updateSwapRequest(requestId: number, updatedSwapRequest: SwapRequest): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/api/SwapRequest/UpdateSwapRequest/${requestId}`, updatedSwapRequest);
  }
}


