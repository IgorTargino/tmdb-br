import { Component, OnInit } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { Movie } from '../entities/movie.entity';
import { MovieApiService } from '../service/movie-api.service';

@Component({
  selector: 'app-popular-movies',
  templateUrl: './popular-movies.component.html',
  styleUrls: ['./popular-movies.component.css'],
})
export class PopularMoviesComponent implements OnInit {
  popularMovies: Movie[] = [];

  constructor(private movieApiService: MovieApiService) {}

  ngOnInit(): void {
    this.loadPopularMovies();
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
        this.popularMovies = movies;
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
    this.popularMovies.forEach((movie) => {
      movie.liked = likedMovies.includes(movie.id);
    });
  }

  private saveLikedMovies(): void {
    const likedMovies = this.popularMovies
      .filter((movie) => movie.liked)
      .map((movie) => movie.id);
    localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
  }
}
