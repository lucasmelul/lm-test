import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesListComponent } from './heroes-list.component';
import { By } from '@angular/platform-browser';
import { PaginatorComponent } from 'src/app/shared/components/paginator/paginator.component';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HeroesListRoutingModule } from './heroes-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeroService } from 'src/app/core/services/hero.service';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import dataHeroes from '../../../../assets/dataHeroes.json';

class HeroServiceStub {
  private heroesTotalObservable = new BehaviorSubject<number>(0);
  heroesTotal$ = this.heroesTotalObservable.asObservable();
  heroes$: Observable<any>;
  getHeroes(){
    return of(dataHeroes)
  }
  removeHero(){
    return of(true)
  }
}

class MatDialogStub {
  open() {
    return {
      afterClosed: () => {
        return of(true)
      }
    }
  }
}

class MatSnackBarStub {
  open() {
    return of(true)
  }
}

fdescribe('HeroesListComponent', () => {
  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroesListComponent ],
      imports: [
        HttpClientTestingModule, 
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: HeroService, useClass: HeroServiceStub },
        { provide: MatDialog, useClass: MatDialogStub },
        { provide: MatSnackBar, useClass: MatSnackBarStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have paginator', () => {
    const de = fixture.debugElement.query(By.directive(PaginatorComponent))
    expect(de).not.toBeNull()
  });

  describe('when removeHero is executed', () => {
    it('when open dialog confirmation return true, should open snackbar', () => {
      const id = 'gsdsd3';
      const openDialog = spyOn((<any>component).confirmationDialog, 'open').and.callThrough()
      const openSnackbar = spyOn((<any>component).snackBar, 'open').and.callThrough();

      component.removeHero(id)
      expect(openDialog).toHaveBeenCalled();

      expect(openSnackbar).toHaveBeenCalledWith('Has eliminado al héroe correctamente!', 'Cerrar', {
        duration: 2000
      });
    })
  })

  describe('when the user insert something in the input filter hero', () => {
    it('should reset page and fetch filtered heroes', () => {
      const query = 'superman'; 
      const input = fixture.debugElement.query(By.css('input'))
      const fetchHeroes = spyOn((<any>component), 'fetchHeroes').and.returnValue(of(dataHeroes));
      component.currentPage = 3;
      input.triggerEventHandler('keyup', {
        target: {
          value: query
        }
      });

      expect(component.query).toBe(query);
      expect(component.currentPage).toBe(1);
      expect(fetchHeroes).toHaveBeenCalled();
    })
  })

  describe('when change page', () => {
    it('should change page and fetch heroes', () => {
      const event = new PageEvent();
      const fetchHeroes = spyOn((<any>component), 'fetchHeroes').and.returnValue(of(dataHeroes));
      event.pageIndex = 2;

      component.changePage(event);

      expect(component.currentPage).toEqual(3);
      expect(fetchHeroes).toHaveBeenCalled();

      const heroService = TestBed.get(HeroService);
      heroService.getHeroes().subscribe((result: any) => {
        expect(result).toBe(dataHeroes);
      })
    })
  })
});
