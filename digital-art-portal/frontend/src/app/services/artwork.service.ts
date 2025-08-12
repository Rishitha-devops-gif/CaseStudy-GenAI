import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Artwork, ArtworkRequest } from '../models/artwork.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private apiUrl = 'http://localhost:3000/api/artworks';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  private handleAuthError(error: any): Observable<never> {
    if (error.status === 401 || error.error?.error === 'Invalid token') {
      this.authService.logout();
      this.router.navigate(['/login']);
      alert('Session expired. Please login again.');
    }
    return throwError(error);
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getArtworks(filters?: any): Observable<Artwork[]> {
    let params = new HttpParams();
    if (filters?.tags) {
      params = params.set('tags', filters.tags);
    }
    return this.http.get<Artwork[]>(this.apiUrl, { params });
  }

  getArtwork(id: number): Observable<Artwork> {
    return this.http.get<Artwork>(`${this.apiUrl}/${id}`);
  }

  createArtwork(artwork: ArtworkRequest): Observable<Artwork> {
    return this.http.post<Artwork>(this.apiUrl, artwork, { headers: this.getHeaders() });
  }

  updateArtwork(id: number, artwork: ArtworkRequest): Observable<Artwork> {
    return this.http.put<Artwork>(`${this.apiUrl}/${id}`, artwork, { headers: this.getHeaders() })
      .pipe(catchError(this.handleAuthError.bind(this)));
  }

  deleteArtwork(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}