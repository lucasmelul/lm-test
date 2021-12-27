import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import dataHeroes from '../../../assets/dataHeroes.json';
import { Hero, ResponseHeroes, HeroesParams } from '../models/hero.model';
import { environment } from '../../../environments/environment';
import { mergeMap, materialize, dematerialize, delay, map, catchError } from 'rxjs/operators';
import { generateId } from '../../utils/utils';

@Injectable()
export class HeroFakeBackendInterceptor implements HttpInterceptor {
  private heroes: Hero[] = dataHeroes;
  private heroesPath = `${environment.apiUrl}/heroes`

  private heroesObservable = new BehaviorSubject<ResponseHeroes>({
    data: this.heroes,
    total: this.heroes.length
  });
  heroes$ = this.heroesObservable.asObservable();

  constructor() {}

  intercept = (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> => {
    const { url, method, body } = request;

    return of(null)
      .pipe(mergeMap(() => this.handleRoute({ url, method, request, next, body })))
      .pipe(delay(500));
  }

  handleRoute = ({ url, method, next, request, body } : { url: string, method: string, request: HttpRequest<unknown>, next: HttpHandler, body: any }) => {
    switch (true) {
      case url.startsWith(`${this.heroesPath}/`) && method === 'GET':
        return this.responseOk(this.getHero(this.idFromUrl(url)));
      case url.match(`${this.heroesPath}`) && method === 'GET':
        return this.responseOk(this.getHeroes({
          limit: this.getNumberParam({url, paramName: 'limit'}), 
          page: this.getNumberParam({url, paramName: 'page'}),
          query: this.getParam({url, paramName: 'query'})
        }));
      case url.match(`${this.heroesPath}`) && method === 'POST':
        return this.responseOk(this.addHero(body));
      case url.match(`${this.heroesPath}/`) && method === 'PUT':
        return this.responseOk(this.editHero({ body, id: this.idFromUrl(url) }));
      case url.match(`${this.heroesPath}/`)&& method === 'DELETE':
        return this.responseOk(this.removeHero(this.idFromUrl(url)));
      default:
        return next.handle(request)
          .pipe(
            catchError(error => {
              return throwError(error);
            })
        );
    }    
  }

  responseOk = (body: any) => {
    return of(new HttpResponse({ status: 200, body }))
  }

  idFromUrl = (url: string) => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  }

  getNumberParam = ({ url, paramName } : { url: string, paramName: string }) => {
    const formattedUrl = new URL(url);
    const param = formattedUrl.searchParams.get(paramName)
    if(!param) return 0
    return parseInt(param)
  }

  getParam = ({ url, paramName } : { url: string, paramName: string}) => {
    const formattedUrl = new URL(url);
    const param = formattedUrl.searchParams.get(paramName)
    if(!param) return ''
    return param
  }

  getHeroes = (params: HeroesParams): Observable<any> => {
    return this.heroes$
      .pipe(
        map( (response: ResponseHeroes) => ({
          data: response.data.filter((hero: Hero) => !params.query || 
              hero.name.toUpperCase().includes(params.query.toUpperCase())
            ),
          total: response.total
        })),
        map((response: ResponseHeroes) => {
          if(!params.page || !params.limit) return response.data;
          const fromIndex = (params.page - 1) * params.limit;
          const filteredHeroes = response.data.slice(fromIndex, fromIndex + params.limit);
          return {
            total: response.data.length,
            data: filteredHeroes
          }
        })
      )
  }

  addHero = (hero: Hero) => { 
    hero.id = generateId();
    this.heroes = [hero, ...this.heroes];
    return this.heroesObservable.next({
      data: this.heroes,
      total: this.heroes.length
    });
  }

  editHero = ({ body, id } : { body: Hero, id: string }) => {
    let hero = this.heroes.find(hero => hero.id === id);
    Object.assign(hero, body);
    return this.heroesObservable.next({
      data: this.heroes,
      total: this.heroes.length
    });
  }

  getHero = (heroId: string) => this.heroes.find((hero: Hero)=> hero.id === heroId);

  removeHero = (heroId: string) => {
    this.heroes = this.heroes.filter((hero: Hero) => hero.id !== heroId);
    return this.heroesObservable.next({
      data: this.heroes,
      total: this.heroes.length
    });
  }
}
