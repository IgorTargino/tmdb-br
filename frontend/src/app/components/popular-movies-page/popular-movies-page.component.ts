import { Component, Input } from '@angular/core';
import { Movie } from 'src/app/entities/movie.entity';

@Component({
  selector: 'app-popular-movies-page',
  templateUrl: './popular-movies-page.component.html',
  styleUrls: ['./popular-movies-page.component.scss'],
})
export class PopularMoviesPageComponent {
  @Input() popularMovies: Movie[] = [];
}
