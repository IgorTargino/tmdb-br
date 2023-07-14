import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private baseUrl = environment.apiUrl;

  constructor() {}
}
