import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PopularMoviesPageComponent } from './components/popular-movies-page/popular-movies-page.component';

const routes: Routes = [
  { path: 'popular-movies', component: PopularMoviesPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
