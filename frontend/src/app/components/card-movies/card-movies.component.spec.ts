import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMoviesComponent } from './card-movies.component';

describe('CardMoviesComponent', () => {
  let component: CardMoviesComponent;
  let fixture: ComponentFixture<CardMoviesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardMoviesComponent],
    });
    fixture = TestBed.createComponent(CardMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
