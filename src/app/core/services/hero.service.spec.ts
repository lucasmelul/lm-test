import { TestBed, getTestBed, tick, fakeAsync } from '@angular/core/testing';

import { HeroService } from './hero.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { Hero, ResponseHeroes } from '../models/hero.model';
import dataHeroes from '../../../assets/dataHeroes.json';
import dataHero from '../../../assets/dataHero.json';
import {of, defer} from 'rxjs';
import { HttpRequest } from '@angular/common/http';

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

fdescribe('HeroService', () => {
  let service: HeroService | null;
  let injector: TestBed | null;
  let httpMock: HttpTestingController | null;
  const heroMock: Hero = dataHero

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [HeroService]
    });

    injector = getTestBed();
    service = injector.get(HeroService)
    httpMock = injector.get(HttpTestingController)
  });

  afterAll(() => {
    service = null; 
    httpMock = null;
    injector = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET', () => {
    it('should execute get all without params', fakeAsync(() => {
      if(!service || !httpMock) return

      const result: any[] = [dataHero];
      const endpoint = `${environment.apiUrl}/heroes?`
      
      service.getHeroes().subscribe((response: any) => {
        const [data] = result
        expect(response).toEqual(data);
      })

      const req = httpMock.expectOne(endpoint)
      expect(req.request.method).toBe('GET');
      req.flush(result);
    }))

    it('should execute get all with params', () => {
      if(!service || !httpMock) return

      const result: any[] = [dataHero];
      const queryParams = {
        limit: 10, 
        page: 1
      } 
      const endpoint = `${environment.apiUrl}/heroes?limit=${queryParams.limit}&page=${queryParams.page}`

      service.getHeroes(queryParams).subscribe((response: any) => {
        const [data] = result
        expect(response).toEqual(data);
      })

      const req = httpMock.expectOne(endpoint)
      expect(req.request.method).toBe('GET');
      req.flush(result);
    })

    it('should execute get by id', () => {
      if(!service || !httpMock) return

      const result: any = dataHero;
      const id: string = 'fg3rda'
      const endpoint = `${environment.apiUrl}/heroes/${id}`

      service.getHero(id).subscribe((response: any) => {
        expect(response).toEqual(result);
      })
 
      const req = httpMock.expectOne(endpoint)
      expect(req.request.method).toBe('GET');
      req.flush(result);
    })

  })

  describe('PUT', () => {
    it('should execute editHero', () => {
      if(!service || !httpMock) return

      const result: any[] = [dataHero];
      const payload: Hero = heroMock 
      const id: string = 'fg3rda'
      const endpoint = `${environment.apiUrl}/heroes/${id}`

      service.editHero({id, hero: payload }).subscribe((response: any) => {
        expect(response.status).toEqual(200);
        expect(response.url).toBe(endpoint)
        expect(response.body).toEqual(result);
      })
 
      const req = httpMock.expectOne(endpoint)
      expect(req.request.method).toBe('PUT');
      req.flush(result);
    })

  }) 

  describe('POST', () => {
    it('should execute addHero', () => {
      if(!service || !httpMock) return

      const result: any[] = [dataHero];
      const payload: Hero = heroMock;
      const endpoint = `${environment.apiUrl}/heroes`

      service.addHero(payload).subscribe((response: any) => {
        expect(response.status).toEqual(200);
        expect(response.url).toBe(endpoint)
        expect(response.body).toEqual(result);
      })
 
      const req = httpMock.expectOne(endpoint)
      expect(req.request.method).toBe('POST');
      req.flush(result);
    }) 
  })

  describe('DELETE', () => {
    it('should execute removeHero', () => {
      if(!service || !httpMock) return

      const result: any[] = [dataHero];
      const id: string = 'fg3rda'
      const endpoint = `${environment.apiUrl}/heroes/${id}`

      service.removeHero(id).subscribe((response: any) => {
        expect(response.status).toEqual(200);
        expect(response.url).toBe(endpoint)
        expect(response.body).toEqual(result);
      })
 
      const req = httpMock.expectOne(endpoint)
      expect(req.request.method).toBe('DELETE');
      req.flush(result);
    })
  }) 


  describe('GET Totals', () => {
    it('should execute getHeroesTotal', () => {
      if(!service) return
      
      service.getHeroesTotal().subscribe((response: any) => {
        expect(dataHeroes.length).toBe(response)
      })
    })

    it('should execute getHeroesInFightTotal', () => {
      if(!service) return
      
      service.getHeroesInFightTotal().subscribe((response: any) => {
        expect(dataHeroes.length).toBe(response)
      })
    })

    it('should execute getLastAddedHeroes', () => {
      if(!service) return
      
      service.getLastAddedHeroes().subscribe((response: any) => {
        expect(dataHeroes.length).toBe(response)
      })
    })

  })
});
