import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}
@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private baseUrl = environment.apiUrl;
  private accessToken: string | undefined;

  constructor(private http: HttpClient) {}

  authenticate(clientId: string, clientSecret: string): Observable<any> {
    const authUrl = `${this.baseUrl}/auth/login`;
    const headers = new HttpHeaders({
      client_Id: clientId,
      client_secret: clientSecret,
    });

    return this.http.post(authUrl, {}, { headers });
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getPopularMovies(limit: number): Observable<Movie[]> {
    const url = `${this.baseUrl}/movie/popular`;

    let params = new HttpParams();
    params = params.set('limit', limit.toString());

    const headers = this.getHeaders();

    return this.http.get<Movie[]>(url, { headers, params });
  }

  getMostLikedMovies(limit: number): Observable<Movie[]> {
    const url = `${this.baseUrl}/movie/most-liked`;

    let params = new HttpParams();
    params = params.set('limit', limit.toString());

    const headers = this.getHeaders();

    return this.http.get<Movie[]>(url, { headers, params });
  }

  likeMovie(
    movieId?: number,
    title?: string,
    overview?: string,
    posterPath?: string
  ): Observable<Movie> {
    const url = `${this.baseUrl}/movie/like`;
    const headers = this.getHeaders();

    let body: any = {};
    if (movieId) {
      body.movieId = movieId;
    } else if (title && overview && posterPath) {
      body = { title, overview, posterPath };
    }

    return this.http.post<Movie>(url, body, { headers });
  }

  dislikeMovie(movieId: number): Observable<Movie> {
    const url = `${this.baseUrl}/movie/dislike`;
    const headers = this.getHeaders();
    const body = { movieId };

    return this.http.post<Movie>(url, body, { headers });
  }

  private getHeaders(): HttpHeaders {
    if (this.accessToken) {
      return new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` });
    } else {
      return new HttpHeaders();
    }
  }
}
