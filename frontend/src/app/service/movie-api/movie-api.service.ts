import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Movie } from '../../entities/movie.entity';
import { LikeMovieDto } from './dto/like-movie.dto';

@Injectable({
  providedIn: 'root',
})
export class MovieApiService {
  private baseUrl = environment.apiUrl;
  private accessToken: string | undefined;

  constructor(private http: HttpClient) {}

  authenticate(clientId: string, clientSecret: string): Observable<any> {
    const authUrl = `${this.baseUrl}/auth/login`;
    const headers = new HttpHeaders({
      client_id: clientId,
      client_secret: clientSecret,
    });

    return this.http.post(authUrl, {}, { headers });
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  private getHeaders(): HttpHeaders {
    console.log(this.accessToken);
    if (this.accessToken) {
      return new HttpHeaders({ Authorization: `Bearer ${this.accessToken}` });
    } else {
      return new HttpHeaders();
    }
  }

  getPopularMovies(limit?: number): Observable<Movie[]> {
    const url = `${this.baseUrl}/movie/popular`;

    let params = new HttpParams();

    if (limit) params = params.set('limit', limit?.toString());

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

  likeMovie({
    movieId,
    title,
    overview,
    posterPath,
  }: LikeMovieDto): Observable<Movie> {
    const url = `${this.baseUrl}/movie/like`;
    const headers = this.getHeaders();

    let body: any = {};
    if (movieId) {
      body.movieId = movieId;
    } else if (title && overview && posterPath) {
      body = { title, overview, poster_path: posterPath };
    }

    return this.http.post<Movie>(url, body, { headers });
  }

  dislikeMovie(movieId: string): Observable<Movie> {
    const url = `${this.baseUrl}/movie/dislike`;
    const headers = this.getHeaders();
    const body = { movieId };

    return this.http.post<Movie>(url, body, { headers });
  }
}
