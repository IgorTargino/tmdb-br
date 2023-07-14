import { Component, Input, OnInit } from '@angular/core';
import { catchError, switchMap } from 'rxjs';
import { Movie } from 'src/app/entities/movie.entity';
import { MovieApiService } from 'src/app/service/movie-api/movie-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card-movies',
  templateUrl: './card-movies.component.html',
  styleUrls: ['./card-movies.component.scss'],
})
export class CardMoviesComponent implements OnInit {
  @Input() movies: Movie[] = [];
  private readonly clientId = environment.client_id;
  private readonly clientSecret = environment.client_secret;

  constructor(private movieApiService: MovieApiService) {}

  ngOnInit(): void {
    this.movieApiService
      .authenticate(this.clientId, this.clientSecret)
      .subscribe(async (response) => {
        await this.movieApiService.setAccessToken(response.access_token);

        this.loadPopularMovies();
      });
  }

  loadPopularMovies(): void {
    this.movieApiService
      .getPopularMovies()
      .pipe(
        catchError((error) => {
          console.log('Erro ao obter os filmes populares:', error);
          return [];
        })
      )
      .subscribe((movies) => {
        this.movies = movies;
        this.loadLikedMovies();
      });
  }

  getMoviePosterUrl(posterPath: string): string {
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }

  toggleLike(movie: Movie): void {
    const likeRequest$ = movie.liked
      ? this.movieApiService.dislikeMovie(movie.id)
      : this.movieApiService.likeMovie({
          movieId: movie.id || '',
          title: movie.title || '',
          overview: movie.overview || '',
          posterPath: movie.poster_path || '',
        });

    likeRequest$
      .pipe(
        switchMap((updatedMovie) => {
          movie.liked = updatedMovie.liked;
          return [];
        }),
        catchError((error) => {
          console.log('Erro ao curtir ou descurtir o filme:', error);
          movie.liked = !movie.liked;
          return [];
        })
      )
      .subscribe(() => {
        this.saveLikedMovies();
      });
  }

  private loadLikedMovies(): void {
    const likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '');
    this.movies.forEach((movie) => {
      movie.liked = likedMovies.includes(movie.id);
    });
  }

  private saveLikedMovies(): void {
    const likedMovies = this.movies
      .filter((movie) => movie.liked)
      .map((movie) => movie.id);
    localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
  }
}
