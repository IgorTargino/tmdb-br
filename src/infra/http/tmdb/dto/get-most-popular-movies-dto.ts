abstract class MovieDTO {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export abstract class ResponseGetMostPopularMoviesDTO {
  page: number;
  results: MovieDTO[];
  total_pages: number;
  total_results: number;
}

export abstract class GetMostPopularMoviesDTO {
  language?: string;
  region?: string;
  page?: number;
}
