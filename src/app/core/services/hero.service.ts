import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';

import { Hero, HeroesParams } from '../models/hero.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  
  private heroesTotalObservable = new BehaviorSubject<number>(0);
  heroesTotal$ = this.heroesTotalObservable.asObservable();

  heroes$ = this.getHeroes()

  newHeroesCount: number = 0;
  private newHeroesObservable = new BehaviorSubject<number>(this.newHeroesCount);
  newHeroes$ = this.newHeroesObservable.asObservable();

  constructor(private httpClient: HttpClient) {}

  getHeroes(params?: HeroesParams): Observable<any> {
    const queryParams = params ? Object.keys(params)
      .filter((key: string) => params.hasOwnProperty(key) )
      .map((key: string) => `${key}=${params[key as keyof HeroesParams]}`)
      .join('&') : ''

    return this.httpClient.get(`${environment.apiUrl}/heroes?${queryParams}`, { observe: "response" })
      .pipe(
        switchMap((data: any) => data.body),
        tap((data: any) => this.heroesTotalObservable.next(data.total))
      )
  }

  getHero = (id: String): Observable<any> => {
    return this.httpClient.get(`${environment.apiUrl}/heroes/${id}`)
  }

  addHero(hero: Hero): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiUrl}/heroes`, hero, { observe: "response" })
      .pipe(
        tap(() => this.newHeroesObservable
          .next(this.newHeroesCount = this.newHeroesCount + 1)
        )
      )
  }

  editHero =  ({ hero, id } : { hero: Hero, id: string }): Observable<any> => {
    return this.httpClient.put<any>(`${environment.apiUrl}/heroes/${id}`, hero, { observe: "response" })
  }

  removeHero = (id: String): Observable<any> => {
    return this.httpClient.delete(`${environment.apiUrl}/heroes/${id}`, { observe: "response" })
      .pipe(
        tap(() => this.newHeroesObservable
          .next(this.newHeroesCount = !this.newHeroesCount ? 
            0 : this.newHeroesCount - 1
          )
        )
      )
  }

  getHeroesTotal = (): Observable<number> => {
    return this.heroes$
      .pipe(
        map((heroes: any) => heroes.length)
      );
  }

  getHeroesInFightTotal = (): Observable<number> => {
    return this.heroes$
      .pipe(
        map((heroes: Hero[]) => heroes.filter((hero: Hero) => hero.inFight)),
        map((heroes: Hero[]) => heroes.length)
      );
  }

  getLastAddedHeroes = (): Observable<Hero[]> => {
    return this.heroes$
      .pipe(
        map((heroes: Hero[]) => heroes.slice(0, 5))
      );
  }

  markAsSeen = () => {
    this.newHeroesObservable.next(this.newHeroesCount = 0)
  }
}
