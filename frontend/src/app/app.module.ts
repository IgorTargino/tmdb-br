import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CardMoviesComponent } from './components/card-movies/card-movies.component';
import { PopularMoviesPageComponent } from './components/popular-movies-page/popular-movies-page.component';

@NgModule({
  declarations: [AppComponent, CardMoviesComponent, PopularMoviesPageComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
