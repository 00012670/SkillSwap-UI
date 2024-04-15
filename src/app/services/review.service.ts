import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Review } from 'src/app/models/review.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(`${this.baseApiUrl}/api/Review/CreateReview`, review);
  }

  getReviewsByUserId(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseApiUrl}/api/Review/GetReviewsByUserId/${userId}`);
  }

  updateReview(reviewId: number, updatedReview: Review): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/api/Review/UpdateReview/${reviewId}`, updatedReview);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/api/Review/DeleteReview/${reviewId}`);
  }

  getReviewsByUserIdAndSkillId(userId: number, skillId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseApiUrl}/api/Review/GetReviewsByUserIdAndSkillId/${userId}/${skillId}`);
  }
}
