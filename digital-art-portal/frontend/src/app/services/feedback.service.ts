import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback, FeedbackRequest } from '../models/feedback.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:3000/api/feedback';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getFeedbackByArtwork(artworkId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/artwork/${artworkId}`);
  }

  createFeedback(feedback: FeedbackRequest): Observable<Feedback> {
    return this.http.post<Feedback>(this.apiUrl, feedback, { headers: this.getHeaders() });
  }

  updateFeedback(id: number, feedback: Partial<FeedbackRequest>): Observable<Feedback> {
    return this.http.put<Feedback>(`${this.apiUrl}/${id}`, feedback, { headers: this.getHeaders() });
  }

  deleteFeedback(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}